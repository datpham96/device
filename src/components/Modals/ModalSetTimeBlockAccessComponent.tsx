/* eslint-disable radix */
import React from 'react';
import {Text} from 'base';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Platform,
} from 'react-native';
import images from 'images';
import FastImage from 'react-native-fast-image';
import {colors, commonStyles, fonts, sizes} from 'styles';
import metrics from 'metrics';
import {TextInput} from 'react-native-gesture-handler';
import TextError from '../TextErrorComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export type Props = {
  visible?: any;
  onPressClose?: any;
  onPressSubmit?: any;
  onChangeTextHoursStart?: any;
  valueHoursStart?: any;
  onFocusHourStart?: any;
  onChangeTextMinutesStart?: any;
  valueMinutesStart?: any;
  onFocusMinuteStart?: any;
  onChangeTextHoursEnd?: any;
  valueHoursEnd?: any;
  onFocusHourEnd?: any;
  onChangeTextMinutesEnd?: any;
  valueMinutesEnd?: any;
  onFocusMinuteEnd?: any;
  timeError?: any;
  onPressWithoutModal?: any;
  onRequestCloseModal?: any;
};

const ModalSetTimeBlockAccessComponent: React.FC<Props> = ({
  visible = false,
  onPressClose,
  onPressSubmit,
  onChangeTextHoursStart,
  valueHoursStart,
  onFocusHourStart,
  onChangeTextMinutesStart,
  valueMinutesStart,
  onFocusMinuteStart,
  onChangeTextHoursEnd,
  valueHoursEnd,
  onFocusHourEnd,
  onChangeTextMinutesEnd,
  valueMinutesEnd,
  onFocusMinuteEnd,
  timeError,
  onRequestCloseModal,
}) => {
  return (
    <Modal
      onRequestClose={onRequestCloseModal}
      animationType="none"
      transparent={true}
      visible={visible}>
      <View style={styles.backgroundModal} />
      <KeyboardAwareScrollView
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={styles.container}>
        <View>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.wrapIconClose}
              activeOpacity={0.8}
              onPress={onPressClose}>
              <FastImage style={styles.iconClose} source={images.icons.close} />
            </TouchableOpacity>
            <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
              Cấu hình thời gian
            </Text>
            <Text style={styles.timeError}>
              {timeError && <TextError message={timeError} />}
            </Text>
            <View style={styles.wrapInputTimes}>
              <View style={styles.contentInputTimes}>
                <Text style={styles.labelInput}>Bắt đầu</Text>
                <View style={styles.wrapInput}>
                  <TextInput
                    onChangeText={onChangeTextHoursStart}
                    value={valueHoursStart}
                    style={styles.inputTime}
                    maxLength={2}
                    keyboardType="number-pad"
                    onFocus={onFocusHourStart}
                  />
                  <Text
                    style={[styles.spaceInput, {color: colors.COLOR_WHITE}]}>
                    :
                  </Text>
                  <TextInput
                    onChangeText={onChangeTextMinutesStart}
                    value={valueMinutesStart}
                    style={styles.inputTime}
                    maxLength={2}
                    keyboardType="number-pad"
                    onFocus={onFocusMinuteStart}
                  />
                </View>
              </View>
              <View style={styles.contentInputTimes}>
                <Text style={styles.labelInput}>Kết thúc</Text>
                <View style={styles.wrapInput}>
                  <TextInput
                    onChangeText={onChangeTextHoursEnd}
                    value={valueHoursEnd}
                    style={styles.inputTime}
                    maxLength={2}
                    keyboardType="number-pad"
                    onFocus={onFocusHourEnd}
                  />
                  <Text
                    style={[styles.spaceInput, {color: colors.COLOR_WHITE}]}>
                    :
                  </Text>
                  <TextInput
                    onChangeText={onChangeTextMinutesEnd}
                    value={valueMinutesEnd}
                    style={styles.inputTime}
                    maxLength={2}
                    keyboardType="number-pad"
                    onFocus={onFocusMinuteEnd}
                  />
                </View>
              </View>
            </View>
            <TouchableHighlight
              underlayColor={colors.COLOR_UNDERLAY_BUTTON_RED}
              activeOpacity={0.9}
              style={styles.btn}
              onPress={onPressSubmit}>
              <Text style={styles.btnLabel}>Lưu lại</Text>
            </TouchableHighlight>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  wrapIconClose: {
    alignSelf: 'flex-end',
  },
  iconClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
    alignSelf: 'flex-end',
  },
  container: {
    ...commonStyles.flex1,
    ...commonStyles.center,
  },
  contentContainer: {
    backgroundColor: colors.COLOR_DARK_BLUE,
    width: metrics.screenWidth - sizes.SIZE_30,
    borderRadius: sizes.SIZE_15,
    padding: sizes.SIZE_15,
    paddingBottom: sizes.SIZE_50,
  },
  mainTitle: {
    fontFamily: fonts.montserrat.FONT_BOLD,
    fontSize: sizes.SIZE_18,
    marginTop: sizes.SIZE_15,
  },
  btn: {
    backgroundColor: colors.COLOR_RED_ORANGE,
    paddingHorizontal: sizes.SIZE_25,
    paddingVertical: sizes.SIZE_10,
    borderRadius: sizes.SIZE_10,
    marginTop: sizes.SIZE_50,
    width: '100%',
    height: sizes.SIZE_45,
    ...commonStyles.center,
  },
  btnLabel: {
    fontSize: sizes.SIZE_13,
  },
  inputTime: {
    width: sizes.SIZE_50,
    height: sizes.SIZE_44,
    backgroundColor: colors.COLOR_WHITE,
    borderRadius: sizes.SIZE_10,
    textAlign: 'center',
    fontFamily: fonts.lexendDeca.FONT_REGULAR,
    fontSize: sizes.SIZE_18,
    color: colors.COLOR_BLACK,
  },
  timeError: {
    marginTop: sizes.SIZE_10,
    textAlign: 'center',
  },
  wrapInputTimes: {
    marginTop: sizes.SIZE_30,
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_20,
  },
  contentInputTimes: {},
  labelInput: {
    fontFamily: fonts.montserrat.FONT_MEDIUM,
    fontSize: sizes.SIZE_16,
  },
  wrapInput: {
    ...commonStyles.flexRowCenter,
    marginTop: sizes.SIZE_10,
  },
  spaceInput: {
    marginHorizontal: sizes.SIZE_10,
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    fontSize: sizes.SIZE_18,
  },
  message: {
    marginHorizontal: sizes.SIZE_20,
  },
});

export default ModalSetTimeBlockAccessComponent;
