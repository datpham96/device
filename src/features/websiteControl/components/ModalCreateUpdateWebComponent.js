/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Input, Radio, Text} from 'base';
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
import {TextError} from 'components';
import {
  getBottomSpace,
  getStatusBarHeight,
  isIphoneX,
} from 'react-native-iphone-x-helper';
import {ModalSetTimeBlockAccess} from 'components';
import lodash from 'lodash';

const HOURS_DEFAULT = '00';
const MINUTE_DEFAULT = '00';
const HOURS_24 = 24;
const HOURS_23 = 23;
const MINUTE_59 = 59;
const MINUTE_60 = 60;
const ZERO = 0;
const TIME_DEFAULT = '00/00';

const ItemTime = ({
  day,
  startTime = TIME_DEFAULT,
  endTime = TIME_DEFAULT,
  containerStyle,
  onPress,
}) => {
  return (
    <TouchableHighlight
      underlayColor="rgba(90, 142, 209, 0.5)"
      onPress={onPress}
      style={[styles.wrapItem, containerStyle]}>
      <>
        <View style={styles.wrapItemTime}>
          <Text style={styles.itemStartTime}>
            {startTime ? startTime : TIME_DEFAULT}
          </Text>
          <Text style={styles.itemEndTime}>
            {endTime ? endTime : TIME_DEFAULT}
          </Text>
        </View>
        <Text style={styles.itemDay}>{day}</Text>
        <FastImage style={styles.itemIconEdit} source={images.icons.edit} />
      </>
    </TouchableHighlight>
  );
};

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
const ModalCreateUpdateWebComponent = ({
  visible = false,
  onPressClose,
  isActive,
  onPressActive,
  value,
  onChangeValue,
  onPressSubmit,
  errors,
  activeItemList,
}) => {
  const [visibleSetupTimeModal, setVisibleSetupTimeModal] = useState(false);
  const [hoursStart, setHoursStart] = useState(HOURS_DEFAULT);
  const [minutesStart, setMinutesStart] = useState(MINUTE_DEFAULT);
  const [hoursEnd, setHoursEnd] = useState(HOURS_DEFAULT);
  const [minutesEnd, setMinutesEnd] = useState(MINUTE_DEFAULT);
  const [activeItem, setActiveItem] = useState({});
  const [timeError, setTimeError] = useState('');
  const [timeList, setTimeList] = useState(DATA_TIME_LIST);

  //set time list by active item list
  useEffect(() => {
    if (activeItemList && activeItemList?.timer?.length > 0) {
      let tmpTimeList = activeItemList?.timer?.map((item, key) => {
        let tmpStartTime = item.start_time;
        let tmpEndTime = item.end_time;
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
  }, [activeItemList, visible]);

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
  };

  const handleShowPopupSetupTime = item => {
    let startTime = item.startTime;
    let endTime = item.endTime;
    let splitStartTime = startTime?.split(':');
    let splitEndTime = endTime?.split(':');
    if (startTime) {
      let tmpHoursStart = splitStartTime.length > 1 ? splitStartTime[0] : '00';
      let tmpMinutesStart =
        splitStartTime.length > 1 ? splitStartTime[1] : '00';
      setHoursStart(tmpHoursStart);
      setMinutesStart(tmpMinutesStart);
    } else {
      setHoursStart(HOURS_DEFAULT);
      setMinutesStart(MINUTE_DEFAULT);
    }

    if (endTime) {
      let tmpHoursEnd = splitEndTime.length > 1 ? splitEndTime[0] : '00';
      let tmpMinutesEnd = splitEndTime.length > 1 ? splitEndTime[1] : '00';
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

    let itemIndex = lodash.findIndex(timeList, {id: activeItem.id});
    if (itemIndex !== -1) {
      timeList[itemIndex] = {
        ...timeList[itemIndex],
        startTime: startTime,
        endTime: endTime,
      };
      setTimeList([...timeList]);
    }

    setVisibleSetupTimeModal(false);
  };

  return (
    <Modal
      onRequestClose={onPressClose}
      animationType="slide"
      transparent={true}
      visible={visible}>
      <ModalSetTimeBlockAccess
        onRequestCloseModal={() => {
          setVisibleSetupTimeModal(false);
          resetState();
        }}
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
            Chặn truy cập website
          </Text>
          <View style={styles.wrapInput}>
            <Input
              containerInput={{borderRadius: sizes.SIZE_10}}
              value={value}
              onChangeValue={onChangeValue}
              placeholder="Nhập địa chỉ website"
            />
            {errors?.url && (
              <TextError
                containerStyle={styles.message}
                message={errors?.url}
              />
            )}
          </View>
          <View style={styles.wrapRadio}>
            <TouchableOpacity activeOpacity={0.9} onPress={onPressActive}>
              <Radio
                label="Cho phép"
                active={isActive ? true : false}
                containerStyle={styles.radioOne}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} onPress={onPressActive}>
              <Radio
                active={!isActive ? true : false}
                label={'Chặn website'}
                containerStyle={styles.radioTwo}
              />
            </TouchableOpacity>
          </View>
          <TouchableHighlight
            underlayColor={colors.COLOR_UNDERLAY_BUTTON_RED}
            activeOpacity={0.9}
            style={styles.btn}
            onPress={() => {
              let arrItem = [];
              timeList?.map(item => {
                arrItem.push({
                  day: item.day,
                  start_time: item.startTime ? item.startTime + ':00' : '',
                  end_time: item.endTime ? item.endTime + ':00' : '',
                });
              });
              onPressSubmit(arrItem);
            }}>
            <Text style={styles.btnLabel}>Lưu lại</Text>
          </TouchableHighlight>
          <Text style={styles.timeUse}>Thời gian sử dụng</Text>
          {isActive &&
            timeList?.map((item, key) => {
              return (
                <View key={key}>
                  <ItemTime
                    onPress={() => handleShowPopupSetupTime(item)}
                    containerStyle={
                      key % 2 === 0
                        ? {backgroundColor: 'rgba(90, 142, 209, 0.1)'}
                        : {}
                    }
                    day={item.dayName}
                    startTime={item.startTime}
                    endTime={item.endTime}
                  />
                </View>
              );
            })}
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
    paddingBottom: sizes.SIZE_25,
  },
  mainTitle: {},
  wrapInput: {
    // paddingHorizontal: sizes.SIZE_10,
    marginTop: sizes.SIZE_30,
  },
  wrapRadio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_10,
    marginTop: sizes.SIZE_25,
  },
  radioOne: {
    marginRight: sizes.SIZE_25,
  },
  radioTwo: {},
  btn: {
    backgroundColor: colors.COLOR_RED_ORANGE,
    // paddingHorizontal: sizes.SIZE_25,
    paddingVertical: sizes.SIZE_10,
    borderRadius: sizes.SIZE_10,
    marginTop: sizes.SIZE_30,
    width: metrics.screenWidth - sizes.SIZE_30,
    alignSelf: 'center',
    ...commonStyles.center,
    height: sizes.SIZE_45,
  },
  btnLabel: {
    fontSize: sizes.SIZE_13,
  },
  message: {
    marginHorizontal: sizes.SIZE_20,
  },
  timeUse: {
    fontFamily: fonts.montserrat.FONT_BOLD,
    fontSize: sizes.SIZE_18,
    marginVertical: sizes.SIZE_15,
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
    ...commonStyles.flex1,
    paddingLeft: sizes.SIZE_15,
  },
  itemIconEdit: {
    width: sizes.SIZE_22,
    height: sizes.SIZE_22,
  },
});

export default ModalCreateUpdateWebComponent;
