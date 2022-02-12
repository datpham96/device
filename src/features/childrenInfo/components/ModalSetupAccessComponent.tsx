import React from 'react';
import {Radio, Text} from 'base';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export type Props = {
  visible?: any;
  onPressClose?: any;
  isActive?: any;
  onPressActive?: any;
  onPressSubmit?: any;
};

const ModalSetupAccessComponent: React.FC<Props> = ({
  visible = false,
  onPressClose,
  isActive,
  onPressActive,
  onPressSubmit,
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
            <FastImage style={styles.image} source={images.logos.success} />
            <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
              Thiết lập quyền chặn
            </Text>
            <View style={styles.wrapRadio}>
              <TouchableOpacity activeOpacity={0.9} onPress={onPressActive}>
                <Radio
                  label="Cơ bản"
                  active={isActive ? true : false}
                  containerStyle={styles.radioOne}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radio}
                activeOpacity={0.9}
                onPress={onPressActive}>
                <Radio
                  active={!isActive ? true : false}
                  label="Nâng cao"
                  containerStyle={styles.radioTwo}
                />
              </TouchableOpacity>
            </View>
            <TouchableHighlight
              underlayColor={colors.COLOR_UNDERLAY_BUTTON_RED}
              activeOpacity={0.9}
              style={styles.btn}
              onPress={onPressSubmit}>
              <Text style={styles.btnLabel}>Đồng ý</Text>
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
  image: {
    width: metrics.screenWidth / sizes.SIZE_7,
    height: metrics.screenWidth / sizes.SIZE_7,
    alignSelf: 'center',
    marginVertical: sizes.SIZE_30,
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
  mainTitle: {
    textAlign: 'center',
  },
  wrapRadio: {
    // flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: sizes.SIZE_30,
    marginTop: sizes.SIZE_30,
  },
  radioOne: {
    marginRight: sizes.SIZE_25,
  },
  radioTwo: {},
  radio: {
    marginTop: sizes.SIZE_20,
  },
  btn: {
    backgroundColor: colors.COLOR_RED_ORANGE,
    alignSelf: 'center',
    paddingHorizontal: sizes.SIZE_25,
    paddingVertical: sizes.SIZE_10,
    borderRadius: sizes.SIZE_25,
    marginTop: sizes.SIZE_50,
    width: sizes.SIZE_120,
  },
  btnLabel: {
    fontSize: sizes.SIZE_13,
    textAlign: 'center',
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

export default ModalSetupAccessComponent;
