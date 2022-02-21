import React, {useRef} from 'react';
import {Input, Radio, Text} from 'base';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
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
  isActive?: any;
  onPressActive?: any;
  value?: any;
  onChangeValue?: any;
  onPressSubmit?: any;
  onChangeTextHours?: any;
  valueHours?: any;
  onChangeTextMinutes?: any;
  valueMinutes?: any;
  errors?: any;
  title?: any;
  isWebsite?: any;
  onFocusHour?: any;
  onFocusMinute?: any;
};

const ModalBlockAccess: React.FC<Props> = ({
  title = 'Chặn truy cập website',
  isWebsite = true,
  visible = false,
  onPressClose,
  isActive,
  onPressActive,
  value,
  onChangeValue,
  onPressSubmit,
  onChangeTextHours,
  valueHours,
  onChangeTextMinutes,
  valueMinutes,
  errors,
  onFocusHour,
  onFocusMinute,
}) => {
  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <View style={styles.backgroundModal} />
      <KeyboardAwareScrollView style={commonStyles.flex1}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.wrapIconClose}
              activeOpacity={0.8}
              onPress={onPressClose}>
              <FastImage style={styles.iconClose} source={images.icons.close} />
            </TouchableOpacity>
            <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
              {title}
            </Text>
            <View style={styles.wrapInput}>
              <Input
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
                  label={'Chặn ' + (isWebsite ? 'website' : 'ứng dụng')}
                  containerStyle={styles.radioTwo}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.wrapInputTimes}>
              <TextInput
                onFocus={onFocusHour}
                editable={isActive}
                onChangeText={onChangeTextHours}
                value={valueHours}
                style={[
                  styles.inputTime,
                  {
                    backgroundColor: !isActive
                      ? colors.COLOR_DISABLE
                      : colors.COLOR_WHITE,
                    color: !isActive ? colors.COLOR_WHITE : colors.COLOR_BLACK,
                  },
                ]}
                maxLength={2}
                keyboardType="number-pad"
              />
              <Text
                style={[
                  styles.spaceInput,
                  {
                    color: !isActive
                      ? colors.COLOR_DISABLE
                      : colors.COLOR_WHITE,
                  },
                ]}>
                :
              </Text>
              <TextInput
                onFocus={onFocusMinute}
                editable={isActive}
                onChangeText={onChangeTextMinutes}
                value={valueMinutes}
                style={[
                  styles.inputTime,
                  {
                    backgroundColor: !isActive
                      ? colors.COLOR_DISABLE
                      : colors.COLOR_WHITE,
                    color: !isActive ? colors.COLOR_WHITE : colors.COLOR_BLACK,
                  },
                ]}
                maxLength={2}
                keyboardType="number-pad"
              />
            </View> */}
            <TouchableHighlight
              underlayColor={colors.COLOR_UNDERLAY_BUTTON_RED}
              activeOpacity={0.9}
              style={styles.btn}
              onPress={onPressSubmit}>
              <Text style={styles.btnLabel}>Lưu</Text>
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
  contentContainer: {
    backgroundColor: colors.COLOR_DARK_BLUE,
    width: metrics.screenWidth - sizes.SIZE_30,
    borderRadius: sizes.SIZE_15,
    padding: sizes.SIZE_15,
    paddingBottom: sizes.SIZE_50,
  },
  mainTitle: {},
  wrapInput: {
    paddingHorizontal: sizes.SIZE_10,
    marginTop: sizes.SIZE_30,
  },
  wrapRadio: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: sizes.SIZE_20,
    marginTop: sizes.SIZE_25,
  },
  radioOne: {
    marginRight: sizes.SIZE_25,
  },
  radioTwo: {},
  btn: {
    backgroundColor: colors.COLOR_RED_ORANGE,
    alignSelf: 'center',
    paddingHorizontal: sizes.SIZE_25,
    paddingVertical: sizes.SIZE_10,
    borderRadius: sizes.SIZE_25,
    marginTop: sizes.SIZE_40,
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
  },
  wrapInputTimes: {
    ...commonStyles.flexRowCenter,
    ...commonStyles.center,
    marginTop: sizes.SIZE_25,
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

export default ModalBlockAccess;
