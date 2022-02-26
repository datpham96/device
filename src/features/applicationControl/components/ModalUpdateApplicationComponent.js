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
import {getBottomSpace, getStatusBarHeight} from 'react-native-iphone-x-helper';
import {ModalSetTimeBlockAccess} from 'components';
import lodash from 'lodash';

const HOURS_DEFAULT = '00';
const MINUTE_DEFAULT = '00';
const HOURS_24 = 24;
const HOURS_23 = 23;
const MINUTE_59 = 59;
const MINUTE_60 = 60;
const ZERO = 0;
const ONE = 1;

export type Props = {
  visible?: any,
  onPressClose?: any,
  isActive?: any,
  onPressActive?: any,
  value?: any,
  onChangeValue?: any,
  onPressSubmit?: any,
  onChangeTextHours?: any,
  valueHours?: any,
  onChangeTextMinutes?: any,
  valueMinutes?: any,
  errors?: any,
  title?: any,
  isWebsite?: any,
  onFocusHour?: any,
  onFocusMinute?: any,
};

export type PropsItem = {
  startTime?: any,
  endTime?: any,
  day?: any,
  containerStyle?: any,
  onPress?: any,
  nameApp?: any,
  iconApp?: any,
};

const ItemTime: React.FC<PropsItem> = ({
  day,
  startTime = '../..',
  endTime = '../..',
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
            {startTime ? startTime : '../..'}
          </Text>
          <Text style={styles.itemEndTime}>{endTime ? endTime : '../..'}</Text>
        </View>
        <Text style={styles.itemDay}>{day}</Text>
        <FastImage style={styles.itemIconEdit} source={images.icons.edit} />
      </>
    </TouchableHighlight>
  );
};

const ModalCreateUpdateWebComponent = ({
  title = 'Chặn truy cập ứng dụng',
  isWebsite = true,
  visible = false,
  onPressClose,
  isActive,
  onPressActive,
  nameApp,
  iconApp,
  onPressSubmit,
  errors,
}) => {
  const [visibleSetupTimeModal, setVisibleSetupTimeModal] = useState(false);
  const [hoursStart, setHoursStart] = useState(HOURS_DEFAULT);
  const [minutesStart, setMinutesStart] = useState(MINUTE_DEFAULT);
  const [hoursEnd, setHoursEnd] = useState(HOURS_DEFAULT);
  const [minutesEnd, setMinutesEnd] = useState(MINUTE_DEFAULT);
  const [activeItem, setActiveItem] = useState({});
  const [timeError, setTimeError] = useState('');
  const [timeList, setTimeList] = useState([
    {
      id: 1,
      day: 'Thứ 2',
      startTime: '08:00',
      endTime: '17:00',
    },
    {
      id: 2,
      day: 'Thứ 3',
      startTime: '08:00',
      endTime: '17:00',
    },
    {
      id: 3,
      day: 'Thứ 4',
      startTime: '',
      endTime: '',
    },
    {
      id: 4,
      day: 'Thứ 5',
      startTime: '08:00',
      endTime: '17:00',
    },
    {
      id: 5,
      day: 'Thứ 6',
      startTime: '08:00',
      endTime: '17:00',
    },
    {
      id: 6,
      day: 'Thứ 7',
      startTime: '',
      endTime: '',
    },
    {
      id: 7,
      day: 'CN',
      startTime: '08:00',
      endTime: '17:00',
    },
  ]);

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
    resetState();
    setVisibleSetupTimeModal(true);
    setActiveItem(item);
  };

  const handleSubmitSetupTime = () => {
    if (!activeItem) {
      return;
    }
    // eslint-disable-next-line radix
    if (parseInt(hoursStart) === 0 && parseInt(minutesStart) === 0) {
      setTimeError('Thời gian bắt đầu không được bỏ trống');
      return;
    }
    // eslint-disable-next-line radix
    if (parseInt(hoursEnd) === 0 && parseInt(minutesEnd) === 0) {
      setTimeError('Thời gian kết thúc không được bỏ trống');
      return;
    }
    if (
      // eslint-disable-next-line radix
      parseInt(hoursEnd) * 60 + parseInt(minutesEnd) <=
      // eslint-disable-next-line radix
      parseInt(hoursStart) * 60 + parseInt(minutesStart)
    ) {
      setTimeError('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc');
      return;
    }
    setTimeError('');
    let startTime = hoursStart + ':' + minutesStart;
    let endTime = hoursEnd + ':' + minutesEnd;
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
    <Modal animationType="none" transparent={true} visible={visible}>
      <ModalSetTimeBlockAccess
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
            onPress={onPressClose}>
            <FastImage style={styles.iconClose} source={images.icons.close} />
          </TouchableOpacity>
          <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
            {title}
          </Text>
          <View style={styles.wrapIcon}>
            <FastImage
              style={styles.appIcon}
              source={iconApp ? {uri: iconApp} : images.avatars.default}
            />
            <Text>{nameApp}</Text>
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
                label={'Chặn ' + (isWebsite ? 'website' : 'ứng dụng')}
                containerStyle={styles.radioTwo}
              />
            </TouchableOpacity>
          </View>
          <TouchableHighlight
            underlayColor={colors.COLOR_UNDERLAY_BUTTON_RED}
            activeOpacity={0.9}
            style={styles.btn}
            onPress={onPressSubmit}>
            <Text style={styles.btnLabel}>Lưu lại</Text>
          </TouchableHighlight>
          <Text style={styles.timeUse}>Thời gian sử dụng</Text>
          {isActive &&
            timeList.map((item, key) => {
              return (
                <View key={key}>
                  <ItemTime
                    onPress={() => handleShowPopupSetupTime(item)}
                    containerStyle={
                      key % 2 === 0
                        ? {backgroundColor: 'rgba(90, 142, 209, 0.1)'}
                        : {}
                    }
                    day={item.day}
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
        ? getStatusBarHeight() + sizes.SIZE_15
        : sizes.SIZE_15,
    height: metrics.screenHeight,
  },
  contentContainer: {
    paddingBottom: sizes.SIZE_15,
  },
  mainTitle: {},
  wrapIcon: {
    ...commonStyles.center,
    marginTop: sizes.SIZE_20,
  },
  appIcon: {
    width: metrics.screenWidth / sizes.SIZE_7,
    height: metrics.screenWidth / sizes.SIZE_7,
    borderRadius: metrics.screenWidth / sizes.SIZE_14,
    borderColor: colors.COLOR_WHITE,
    borderWidth: sizes.SIZE_4,
    marginBottom: sizes.SIZE_10,
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
