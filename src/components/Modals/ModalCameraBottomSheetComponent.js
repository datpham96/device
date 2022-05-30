import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
//node_modules
import {getBottomSpace} from 'react-native-iphone-x-helper';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
//api
//base
import {Text} from 'base';
//components
//config
import {sizes, commonStyles, colors} from 'styles';
import metrics from 'metrics';
//helpers
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
//code-splitting
//screen
const options = {
  mediaType: 'photo',
  quality: 1,
  includeBase64: true,
};

const ModalBottomSheetComponent = ({
  onPressClose,
  onPressCancel,
  setDataRequestAvatar,
  setAvatarUri,
}) => {
  const scaleAni = useRef(new Animated.Value(280)).current;
  useEffect(() => {
    Animated.timing(scaleAni, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [scaleAni]);

  const handleOpenCamera = () => {
    options.mediaType = 'photo';
    launchCamera(options, response => {
      if (response && response?.assets) {
        let item = response?.assets?.[0];
        let dataFirstBase64 = 'data:' + item?.type + ';base64,';
        let formatData = dataFirstBase64 + item?.base64;
        ImageResizer.createResizedImage(
          formatData,
          300,
          300,
          'JPEG',
          100,
          Platform.OS === 'android' ? 90 : 0,
          undefined,
          false,
          {},
        )
          .then(resp => {
            return RNFS.readFile(resp?.path, 'base64');
          })
          .then(result => {
            setDataRequestAvatar(dataFirstBase64 + result);
          });
        setAvatarUri({uri: item?.uri});
      }
    });
  };

  const handleOpenLibrary = () => {
    options.mediaType = 'photo';
    launchImageLibrary(options, response => {
      if (response && response?.assets) {
        let item = response?.assets?.[0];
        let dataFirstBase64 = 'data:' + item?.type + ';base64,';
        let formatData = dataFirstBase64 + item?.base64;
        ImageResizer.createResizedImage(
          formatData,
          300,
          300,
          'JPEG',
          100,
          Platform.OS === 'android' ? 90 : 0,
          undefined,
          false,
          {},
        )
          .then(resp => {
            return RNFS.readFile(resp?.path, 'base64');
          })
          .then(result => {
            setDataRequestAvatar(dataFirstBase64 + result);
          });
        setAvatarUri({uri: item?.uri});
      }
    });
  };
  return (
    <Modal
      onRequestClose={onPressClose}
      style={styles.container}
      visible={true}
      transparent={true}
      animationType="none">
      <TouchableOpacity
        activeOpacity={1}
        style={styles.wrapPress}
        onPress={onPressClose}>
        <Animated.View
          style={[styles.wrapBox, {transform: [{translateY: scaleAni}]}]}>
          <View style={styles.contentContainer}>
            <Text style={styles.label}>Chọn ảnh</Text>
            <View style={styles.line} />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                onPressClose();
                setTimeout(() => {
                  handleOpenCamera();
                }, 200);
              }}
              style={styles.wrapSelect}>
              <Text style={styles.labelSelect}>Chụp ảnh</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                onPressClose();
                setTimeout(() => {
                  handleOpenLibrary();
                }, 200);
              }}
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
        </Animated.View>
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
