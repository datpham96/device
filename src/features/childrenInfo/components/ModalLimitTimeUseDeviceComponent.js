/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Switch, Text} from 'base';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  ScrollView,
  Platform,
} from 'react-native';
import images from 'images';
import FastImage from 'react-native-fast-image';
import {colors, commonStyles, fonts, sizes} from 'styles';
import metrics from 'metrics';
import {
  getBottomSpace,
  getStatusBarHeight,
  isIphoneX,
} from 'react-native-iphone-x-helper';
import {
  ModalSetTimeBlockAccess,
  PopupAlert,
  ItemTimeUse,
  Loading,
} from 'components';
import lodash from 'lodash';
import {deviceTimerAccessUpdateApi} from 'src/api/methods/device';
import {useMutation} from 'react-query';

const HOURS_DEFAULT = '00';
const MINUTE_DEFAULT = '00';
const HOURS_24 = 24;
const HOURS_23 = 23;
const MINUTE_59 = 59;
const MINUTE_60 = 60;
const ZERO = 0;
const TIME_DEFAULT = '00/00';

// const ItemTime = ({
//   day,
//   startTime = TIME_DEFAULT,
//   endTime = TIME_DEFAULT,
//   onChangeSwitch,
//   status,
//   containerStyle,
//   onPress,
// }) => {
//   const [toggleSwitch, setToggleSwitch] = useState(status ? true : false);
//   return (
//     <TouchableHighlight
//       underlayColor="rgba(90, 142, 209, 0.5)"
//       onPress={onPress}
//       style={[styles.wrapItem, containerStyle]}>
//       <>
//         <View style={styles.wrapItemTime}>
//           <Text style={styles.itemStartTime}>
//             {startTime ? startTime : TIME_DEFAULT}
//           </Text>
//           <Text style={styles.itemEndTime}>
//             {endTime ? endTime : TIME_DEFAULT}
//           </Text>
//         </View>
//         <Text style={styles.itemDay}>{day}</Text>
//         <View style={styles.wrapSectionRight}>
//           <Switch
//             onValueChange={() => {
//               onChangeSwitch(!toggleSwitch);
//               setToggleSwitch(!toggleSwitch);
//             }}
//             value={toggleSwitch}
//             containerStyle={styles.switch}
//           />
//         </View>
//         <FastImage style={styles.itemIconEdit} source={images.icons.edit} />
//       </>
//     </TouchableHighlight>
//   );
// };

const DATA_TIME_LIST = [
  {
    id: 1,
    day: 2,
    dayName: 'Thứ 2',
    startTime: '',
    endTime: '',
  },
  {
    id: 2,
    day: 3,
    dayName: 'Thứ 3',
    startTime: '',
    endTime: '',
  },
  {
    id: 3,
    day: 4,
    dayName: 'Thứ 4',
    startTime: '',
    endTime: '',
  },
  {
    id: 4,
    day: 5,
    dayName: 'Thứ 5',
    startTime: '',
    endTime: '',
  },
  {
    id: 5,
    day: 6,
    dayName: 'Thứ 6',
    startTime: '',
    endTime: '',
  },
  {
    id: 6,
    day: 7,
    dayName: 'Thứ 7',
    startTime: '',
    endTime: '',
  },
  {
    id: 7,
    day: 8,
    dayName: 'CN',
    startTime: '',
    endTime: '',
  },
];
const ModalLimitTimeUseDeviceComponent = ({
  visible = false,
  onPressClose,
  itemList,
  deviceId,
  onSuccessTimer,
  onRequestCloseModal,
}) => {
  const [visibleSetupTimeModal, setVisibleSetupTimeModal] = useState(false);
  const [hoursStart, setHoursStart] = useState(HOURS_DEFAULT);
  const [minutesStart, setMinutesStart] = useState(MINUTE_DEFAULT);
  const [hoursEnd, setHoursEnd] = useState(HOURS_DEFAULT);
  const [minutesEnd, setMinutesEnd] = useState(MINUTE_DEFAULT);
  const [activeItem, setActiveItem] = useState({});
  const [timeError, setTimeError] = useState('');
  const [timeList, setTimeList] = useState(DATA_TIME_LIST);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [isUpdateTimerSuccess, setIsUpdateTimerSuccess] = useState(false);

  const mutationTimerUpdate = useMutation(({data_device_id, data_timer_list}) =>
    deviceTimerAccessUpdateApi(data_device_id, data_timer_list),
  );

  //set time list by active item list
  useEffect(() => {
    if (itemList && itemList?.timer?.length > 0) {
      let tmpTimeList = itemList?.timer?.map((item, key) => {
        let tmpStartTime = item?.start_time;
        let tmpEndTime = item?.end_time;
        if (tmpStartTime || tmpEndTime) {
          let tmpHoursStartTime = tmpStartTime
            ? tmpStartTime?.split(':')[0]
            : HOURS_DEFAULT;
          let tmpHoursEndTime = tmpEndTime
            ? tmpEndTime?.split(':')[0]
            : HOURS_DEFAULT;
          let tmpMinuteStartTime = tmpStartTime
            ? tmpStartTime?.split(':')[1]
            : MINUTE_DEFAULT;
          let tmpMinuteEndTime = tmpEndTime
            ? tmpEndTime?.split(':')[1]
            : MINUTE_DEFAULT;
          return {
            ...item,
            day: key + 2,
            dayName: key + 2 === 8 ? 'CN' : 'Thứ ' + (key + 2),
            startTime: tmpStartTime
              ? tmpHoursStartTime + ':' + tmpMinuteStartTime
              : TIME_DEFAULT,
            endTime: tmpEndTime
              ? tmpHoursEndTime + ':' + tmpMinuteEndTime
              : TIME_DEFAULT,
          };
        } else {
          return {
            ...item,
            day: key + 2,
            dayName: key + 2 === 8 ? 'CN' : 'Thứ ' + (key + 2),
            startTime: '',
            endTime: '',
          };
        }
      });
      setTimeList(tmpTimeList);
    }
  }, [itemList, visible]);

  //set hours start
  useEffect(() => {
    // eslint-disable-next-line radix
    if (parseInt(hoursStart) > ZERO && parseInt(hoursStart) > HOURS_24) {
      setHoursStart(HOURS_24.toString());
    }
  }, [hoursStart]);

  //set hours end
  useEffect(() => {
    // eslint-disable-next-line radix
    if (parseInt(hoursEnd) > ZERO && parseInt(hoursEnd) > HOURS_24) {
      setHoursEnd(HOURS_24.toString());
    }
  }, [hoursEnd]);

  //set minutes start
  useEffect(() => {
    // eslint-disable-next-line radix
    if (parseInt(minutesStart) > ZERO && parseInt(minutesStart) >= MINUTE_60) {
      setMinutesStart(MINUTE_59.toString());
    }
    // eslint-disable-next-line radix
    if (parseInt(minutesStart) > ZERO && parseInt(hoursStart) === HOURS_24) {
      setHoursStart(HOURS_23.toString());
    }
  }, [minutesStart, hoursStart]);

  //set minutes end
  useEffect(() => {
    // eslint-disable-next-line radix
    if (parseInt(minutesEnd) > ZERO && parseInt(minutesEnd) >= MINUTE_60) {
      setMinutesEnd(MINUTE_59.toString());
    }
    // eslint-disable-next-line radix
    if (parseInt(minutesEnd) > ZERO && parseInt(hoursEnd) === HOURS_24) {
      setHoursEnd(HOURS_23.toString());
    }
  }, [minutesEnd, hoursEnd]);

  const resetState = () => {
    setHoursStart(HOURS_DEFAULT);
    setHoursEnd(HOURS_DEFAULT);
    setMinutesStart(MINUTE_DEFAULT);
    setMinutesEnd(MINUTE_DEFAULT);
    setTimeError('');
  };

  const handleShowPopupSetupTime = item => {
    let startTime = item?.startTime;
    let endTime = item?.endTime;
    let splitStartTime = startTime?.split(':');
    let splitEndTime = endTime?.split(':');
    if (startTime) {
      let tmpHoursStart =
        splitStartTime?.length > 1 ? splitStartTime?.[0] : '00';
      if (parseInt(tmpHoursStart) >= 1 && parseInt(tmpHoursStart) < 10) {
        tmpHoursStart = '0' + parseInt(tmpHoursStart);
      }
      let tmpMinutesStart =
        splitStartTime?.length > 1 ? splitStartTime?.[1] : '00';
      if (parseInt(tmpMinutesStart) >= 1 && parseInt(tmpMinutesStart) < 10) {
        tmpMinutesStart = '0' + parseInt(tmpMinutesStart);
      }
      setHoursStart(tmpHoursStart);
      setMinutesStart(tmpMinutesStart);
    } else {
      setHoursStart(HOURS_DEFAULT);
      setMinutesStart(MINUTE_DEFAULT);
    }

    if (endTime) {
      let tmpHoursEnd = splitEndTime?.length > 1 ? splitEndTime?.[0] : '00';
      if (parseInt(tmpHoursEnd) >= 1 && parseInt(tmpHoursEnd) < 10) {
        tmpHoursEnd = '0' + parseInt(tmpHoursEnd);
      }
      let tmpMinutesEnd = splitEndTime?.length > 1 ? splitEndTime?.[1] : '00';
      if (parseInt(tmpMinutesEnd) >= 1 && parseInt(tmpMinutesEnd) < 10) {
        tmpMinutesEnd = '0' + parseInt(tmpMinutesEnd);
      }
      setHoursEnd(tmpHoursEnd);
      setMinutesEnd(tmpMinutesEnd);
    } else {
      setHoursEnd(HOURS_DEFAULT);
      setMinutesEnd(MINUTE_DEFAULT);
    }

    setVisibleSetupTimeModal(true);
    setActiveItem(item);
  };

  const handleSubmitSetupTime = () => {
    if (!activeItem) {
      return;
    }
    // // eslint-disable-next-line radix
    // if (parseInt(hoursStart) === 0 && parseInt(minutesStart) === 0) {
    //   setTimeError('Thời gian bắt đầu không được bỏ trống');
    //   return;
    // }
    // // eslint-disable-next-line radix
    // if (parseInt(hoursEnd) === 0 && parseInt(minutesEnd) === 0) {
    //   setTimeError('Thời gian kết thúc không được bỏ trống');
    //   return;
    // }
    if (
      // eslint-disable-next-line radix
      parseInt(hoursEnd) * 60 + parseInt(minutesEnd) > 0 &&
      // eslint-disable-next-line radix
      parseInt(hoursStart) * 60 + parseInt(minutesStart) > 0
    ) {
      if (
        // eslint-disable-next-line radix
        parseInt(hoursEnd) * 60 + parseInt(minutesEnd) <=
        // eslint-disable-next-line radix
        parseInt(hoursStart) * 60 + parseInt(minutesStart)
      ) {
        setTimeError('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc');
        return;
      }
    }

    setTimeError('');
    let startTime = '';
    let endTime = '';
    if (parseFloat(hoursStart) > 0 || parseFloat(minutesStart) > 0) {
      startTime =
        (hoursStart ? hoursStart : '00') +
        ':' +
        (minutesStart ? minutesStart : '00');
    }
    if (parseFloat(hoursEnd) > 0 || parseFloat(minutesEnd) > 0) {
      endTime =
        (hoursEnd ? hoursEnd : '00') + ':' + (minutesEnd ? minutesEnd : '00');
    }

    let itemIndex = lodash.findIndex(timeList, {id: activeItem?.id});
    if (itemIndex !== -1) {
      timeList[itemIndex] = {
        ...timeList[itemIndex],
        startTime: startTime,
        endTime: endTime,
      };
      // setTimeList([...timeList]);
    }

    setVisibleSetupTimeModal(false);

    //handle request time use
    let arrItem = [];
    timeList?.map(item => {
      arrItem.push({
        day: item?.day,
        start_time: item?.startTime ? item.startTime + ':00' : '',
        end_time: item?.endTime ? item?.endTime + ':00' : '',
        status: item?.status ? 1 : 0,
      });
    });

    mutationTimerUpdate
      .mutateAsync({
        data_device_id: deviceId,
        data_timer_list: arrItem,
      })
      .then(resp => {
        if (resp?.status) {
          setIsUpdateTimerSuccess(true);
          setVisibleAlert(true);
          onSuccessTimer();
        } else {
          setIsUpdateTimerSuccess(false);
        }
        mutationTimerUpdate.reset();
      })
      .catch(err => {
        console.log(err?.msg);
      });
  };

  const handleResetInputTime = () => {
    // if (checkVar.isEmpty(hoursStart)) {
    //   setHoursStart(HOURS_DEFAULT);
    // }
    // if (checkVar.isEmpty(minutesStart)) {
    //   setMinutesStart(MINUTE_DEFAULT);
    // }
    // if (checkVar.isEmpty(hoursEnd)) {
    //   setHoursEnd(HOURS_DEFAULT);
    // }
    // if (checkVar.isEmpty(minutesEnd)) {
    //   setMinutesEnd(MINUTE_DEFAULT);
    // }
  };

  const handleSwitch = (status, key) => {
    let arrItem = [];
    timeList?.map(item => {
      arrItem.push({
        day: item?.day,
        start_time: item?.startTime ? item.startTime + ':00' : '',
        end_time: item?.endTime ? item?.endTime + ':00' : '',
        status: item.status,
      });
    });

    if (arrItem) {
      arrItem[key] = {...arrItem[key], status: status ? 1 : 0};
    }
    mutationTimerUpdate
      .mutateAsync({
        data_device_id: deviceId,
        data_timer_list: arrItem,
      })
      .then(resp => {
        if (resp?.status) {
          setIsUpdateTimerSuccess(true);
          setVisibleAlert(true);
          onSuccessTimer();
        } else {
          setIsUpdateTimerSuccess(false);
        }
        mutationTimerUpdate.reset();
      })
      .catch(err => {
        console.log(err?.msg);
      });
  };

  return (
    <Modal
      onRequestClose={onRequestCloseModal}
      animationType="none"
      transparent={true}
      visible={visible}>
      <Loading isLoading={mutationTimerUpdate?.isLoading} />
      <PopupAlert
        content={
          isUpdateTimerSuccess
            ? 'Cập nhật giới hạn thời gian sử dụng thành công!'
            : 'Cập nhật giới hạn thời gian sử dụng thất bại!'
        }
        srcImage={
          !isUpdateTimerSuccess ? images.logos.error : images.logos.success
        }
        visible={visibleAlert}
        onPressCancel={() => setVisibleAlert(false)}
      />
      <ModalSetTimeBlockAccess
        onRequestCloseModal={() => {
          setVisibleSetupTimeModal(false);
          resetState();
        }}
        onPressWithoutModal={handleResetInputTime}
        timeError={timeError}
        onPressClose={() => {
          setVisibleSetupTimeModal(false);
          resetState();
        }}
        visible={visibleSetupTimeModal}
        onChangeTextHoursStart={text => setHoursStart(text)}
        valueHoursStart={hoursStart}
        onFocusHourStart={() => {
          // eslint-disable-next-line radix
          if (hoursStart.length === 2 && parseInt(hoursStart) === 0) {
            setHoursStart('');
          }
        }}
        onChangeTextMinutesStart={text => setMinutesStart(text)}
        valueMinutesStart={minutesStart}
        onFocusMinuteStart={() => {
          // eslint-disable-next-line radix
          if (minutesStart.length === 2 && parseInt(minutesStart) === 0) {
            setMinutesStart('');
          }
        }}
        onChangeTextHoursEnd={text => setHoursEnd(text)}
        valueHoursEnd={hoursEnd}
        onFocusHourEnd={() => {
          // eslint-disable-next-line radix
          if (hoursEnd.length === 2 && parseInt(hoursEnd) === 0) {
            setHoursEnd('');
          }
        }}
        onChangeTextMinutesEnd={text => setMinutesEnd(text)}
        valueMinutesEnd={minutesEnd}
        onFocusMinuteEnd={() => {
          // eslint-disable-next-line radix
          if (minutesEnd.length === 2 && parseInt(minutesEnd) === 0) {
            setMinutesEnd('');
          }
        }}
        onPressSubmit={handleSubmitSetupTime}
      />
      <View style={styles.backgroundModal} />
      {/* <KeyboardAwareScrollView style={commonStyles.flex1}> */}
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.wrapIconClose}
            activeOpacity={0.8}
            onPress={() => {
              onPressClose();
              setTimeList([...DATA_TIME_LIST]);
            }}>
            <FastImage style={styles.iconClose} source={images.icons.close} />
          </TouchableOpacity>
          <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
            {'Giới hạn thời \ngian sử dụng'}
          </Text>
          <View style={styles.wrapTimeList}>
            {timeList?.map((item, key) => {
              return (
                <View key={`${item.id} + ${item.status}`}>
                  <ItemTimeUse
                    onPress={() => handleShowPopupSetupTime(item)}
                    containerStyle={
                      key % 2 === 0
                        ? {backgroundColor: 'rgba(90, 142, 209, 0.1)'}
                        : {}
                    }
                    status={item.status}
                    onChangeSwitch={status => handleSwitch(status, key)}
                    day={item.dayName}
                    startTime={item.startTime}
                    endTime={item.endTime}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.wrapNote}>
            <View style={styles.wrapIconLabelNote}>
              <FastImage
                style={styles.iconNote}
                source={images.icons.question}
              />
              <Text style={styles.labelNote}>Ghi chú</Text>
            </View>
            <Text style={styles.note}>
              {
                'Đây là khung thời gian máy tính có thể sử dụng được. \nNgoài khung thời gian trên, máy tính sẽ bị khóa.\nĐặt giới hạn từ 00:00 đến 00:00 nếu phụ huynh muốn máy sử dụng được 24h/ngày.'
              }
            </Text>
          </View>
        </ScrollView>
      </View>
      {/* </KeyboardAwareScrollView> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...commonStyles.center,
  },
  backgroundModal: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    backgroundColor: colors.COLOR_BLACK,
    position: 'absolute',
    opacity: 0.5,
    zIndex: 0,
  },
  iconClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
  },
  wrapIconClose: {
    alignSelf: 'flex-end',
  },
  container: {
    ...commonStyles.flex1,
    ...commonStyles.center,
    height: metrics.screenHeight,
  },
  scrollContainer: {
    backgroundColor: colors.COLOR_DARK_BLUE,
    width: metrics.screenWidth,
    borderRadius: sizes.SIZE_15,
    padding: sizes.SIZE_15,
    paddingBottom: getBottomSpace(),
    paddingTop:
      Platform.OS === 'ios'
        ? isIphoneX()
          ? getStatusBarHeight() + sizes.SIZE_15
          : getStatusBarHeight() + sizes.SIZE_5
        : sizes.SIZE_15,
    height: metrics.screenHeight,
  },
  contentContainer: {
    paddingBottom: sizes.SIZE_35,
  },
  mainTitle: {},
  wrapTimeList: {
    marginTop: sizes.SIZE_25,
  },
  //item
  wrapItem: {
    // backgroundColor: 'red',
    ...commonStyles.flexRowCenter,
    paddingHorizontal: sizes.SIZE_15,
    paddingVertical: sizes.SIZE_12,
    marginBottom: sizes.SIZE_10,
    borderRadius: sizes.SIZE_10,
  },
  wrapItemTime: {
    width: sizes.SIZE_60,
  },
  itemStartTime: {
    fontFamily: fonts.montserrat.FONT_REGULAR,
    fontSize: sizes.SIZE_16,
  },
  itemEndTime: {
    fontFamily: fonts.montserrat.FONT_REGULAR,
    fontSize: sizes.SIZE_12,
  },
  itemDay: {
    fontFamily: fonts.montserrat.FONT_REGULAR,
    fontSize: sizes.SIZE_16,
    marginHorizontal: sizes.SIZE_15,
    // ...commonStyles.flex1,
    paddingLeft: sizes.SIZE_15,
    width: sizes.SIZE_70,
  },
  wrapSectionRight: {
    ...commonStyles.flex1,
  },
  switch: {
    alignSelf: 'center',
  },
  wrapEdit: {
    backgroundColor: 'red',
    height: '100%',
    width: sizes.SIZE_40,
  },
  itemIconEdit: {
    width: sizes.SIZE_22,
    height: sizes.SIZE_22,
  },
  wrapNote: {
    marginTop: sizes.SIZE_20,
  },
  wrapIconLabelNote: {
    ...commonStyles.flexRowCenter,
  },
  iconNote: {
    width: sizes.SIZE_20,
    height: sizes.SIZE_20,
  },
  labelNote: {
    marginLeft: sizes.SIZE_5,
    fontFamily: fonts.montserrat.FONT_BOLD,
  },
  note: {
    lineHeight: sizes.SIZE_22,
    marginTop: sizes.SIZE_7,
    textAlign: 'justify',
    fontFamily: fonts.lexendDeca.FONT_LIGHT,
  },
});

export default ModalLimitTimeUseDeviceComponent;
