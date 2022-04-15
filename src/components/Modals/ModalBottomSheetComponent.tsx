import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Text} from 'base';
import {sizes, commonStyles, colors} from 'styles';
import metrics from 'metrics';
import {getBottomSpace} from 'react-native-iphone-x-helper';

export type Props = {
  visible?: any;
  onPressClose?: any;
  onPressCancel?: any;
  onPressOne?: any;
  onPressTwo?: any;
};

const ModalBottomSheetComponent: React.FC<Props> = ({
  visible = false,
  onPressClose,
  onPressCancel,
  onPressOne,
  onPressTwo,
}) => {
  return (
    <Modal
      onRequestClose={onPressClose}
      style={styles.container}
      visible={visible}
      transparent={true}
      animationType="none">
      <TouchableOpacity
        activeOpacity={1}
        style={styles.wrapPress}
        onPress={onPressClose}>
        <View style={styles.wrapBox}>
          <View style={styles.contentContainer}>
            <Text style={styles.label}>Chọn ảnh</Text>
            <View style={styles.line} />
            <TouchableOpacity
              activeOpacity={1}
              onPress={onPressOne}
              style={styles.wrapSelect}>
              <Text style={styles.labelSelect}>Chụp ảnh</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              activeOpacity={1}
              onPress={onPressTwo}
              style={styles.wrapSelect}>
              <Text style={styles.labelSelect}>Chọn từ thư viện</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.wrapCancel}
            activeOpacity={1}
            onPress={onPressCancel}>
            <Text style={styles.labelCancel}>Huỷ bỏ</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const SIZE_250 = 250;
const styles = StyleSheet.create({
  container: {},
  wrapPress: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
  },
  wrapBox: {
    width: metrics.screenWidth - sizes.SIZE_30,
    height: Platform.OS === 'ios' ? 'auto' : SIZE_250,
    backgroundColor: 'transparent',
    position: 'absolute',
    alignSelf: 'center',
    bottom: getBottomSpace() + sizes.SIZE_5,
  },
  contentContainer: {
    backgroundColor: colors.COLOR_WHITE,
    alignItems: 'center',
    paddingTop: sizes.SIZE_20,
    borderRadius: sizes.SIZE_10,
  },
  label: {
    color: colors.COLOR_GREY,
    paddingBottom: sizes.SIZE_15,
  },
  wrapSelect: {
    paddingVertical: sizes.SIZE_15,
    width: '100%',
    ...commonStyles.center,
  },
  line: {
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: sizes.SIZE_1,
    width: '100%',
  },
  labelSelect: {
    color: colors.COLOR_BLUE,
    fontSize: sizes.SIZE_18,
  },
  wrapCancel: {
    backgroundColor: colors.COLOR_WHITE,
    marginTop: sizes.SIZE_5,
    ...commonStyles.center,
    borderRadius: sizes.SIZE_10,
  },
  labelCancel: {
    color: colors.COLOR_GREY,
    paddingVertical: sizes.SIZE_15,
    fontSize: sizes.SIZE_18,
  },
});

export default ModalBottomSheetComponent;
