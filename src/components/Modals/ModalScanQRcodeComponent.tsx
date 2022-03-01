import React, {useState} from 'react';
import {Background, Text} from 'base';
import {View, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import images from 'images';
import FastImage from 'react-native-fast-image';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {colors, commonStyles, sizes} from 'styles';
import metrics from 'metrics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type Props = {
  visible?: any;
  onPressClose?: any;
  onSuccessQRCode?: any;
  onPressCamera?: any;
};

const ModalScanQRcode: React.FC<Props> = ({
  visible = false,
  onPressClose,
  onSuccessQRCode,
}) => {
  const [toggleFlash, setToggleFlash] = useState(false);
  const [toggleCameraReverse, setToggleCameraReverse] = useState(false);
  return (
    <Modal animationType="fade" style={styles.modalContainer} visible={visible}>
      <Background bout>
        <View>
          <TouchableOpacity
            style={styles.wrapClose}
            activeOpacity={0.8}
            onPress={onPressClose}>
            <FastImage style={styles.iconClose} source={images.icons.close} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconCameraReverse}
            activeOpacity={0.5}
            onPress={() => setToggleCameraReverse(!toggleCameraReverse)}>
            <Ionicons
              name="md-camera-reverse-outline"
              size={sizes.SIZE_30}
              color={colors.COLOR_WHITE}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <QRCodeScanner
            onRead={onSuccessQRCode}
            cameraStyle={styles.cameraStyles}
            topContent={<Text>Quét mã QR</Text>}
            cameraProps={{ratio: '1:1'}}
            cameraType={toggleCameraReverse ? 'front' : 'back'}
            // @ts-ignore
            flashMode={
              toggleFlash
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off
            }
            showMarker
            customMarker={
              <View style={styles.containerMarker}>
                <View style={styles.wrapConnerTopLeft}>
                  <View style={styles.barMarkerOne} />
                  <View style={styles.barMarkerTwo} />
                </View>
                <View style={styles.wrapConnerTopRight}>
                  <View style={styles.barMarkerOne} />
                  <View style={styles.barMarkerTwo} />
                </View>
                <View style={styles.wrapConnerBottomLeft}>
                  <View style={styles.barMarkerOne} />
                  <View style={styles.barMarkerTwo} />
                </View>
                <View style={styles.wrapConnerBottomRight}>
                  <View style={styles.barMarkerOne} />
                  <View style={styles.barMarkerTwo} />
                </View>
              </View>
            }
            bottomContent={
              <View>
                {!toggleCameraReverse && (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setToggleFlash(!toggleFlash)}>
                    <MaterialCommunityIcons
                      style={styles.iconFlash}
                      name={toggleFlash ? 'flashlight' : 'flashlight-off'}
                      size={sizes.SIZE_30}
                      color={colors.COLOR_WHITE}
                    />
                  </TouchableOpacity>
                )}
                <Text>Di chuyển camera đến gần mã QR code</Text>
              </View>
            }
          />
        </View>
      </Background>
    </Modal>
  );
};

const SIZE_BAR_MARKER = sizes.SIZE_20;
const SIZE_CAMERA = metrics.screenWidth * 0.6;

const styles = StyleSheet.create({
  modalContainer: {
    width: metrics.screenWidth,
  },
  iconCameraReverse: {
    marginTop: sizes.SIZE_10,
    marginLeft: sizes.SIZE_20,
    alignSelf: 'baseline',
  },
  wrapClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
    position: 'absolute',
    right: sizes.SIZE_20,
    top: sizes.SIZE_10,
  },
  iconClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
  },
  contentContainer: {
    // marginTop: sizes.SIZE_50,
    ...commonStyles.flex1,
  },
  //camera qrCode
  centerText: {
    ...commonStyles.flex1,
    fontSize: sizes.SIZE_18,
    padding: sizes.SIZE_32,
  },
  cameraStyles: {
    width: SIZE_CAMERA,
    height: SIZE_CAMERA,
    alignSelf: 'center',
    borderRadius: sizes.SIZE_20,
  },
  iconCamera: {
    width: sizes.SIZE_35,
    height: sizes.SIZE_35,
    alignSelf: 'center',
    marginBottom: sizes.SIZE_15,
  },
  //marker qrcode
  containerMarker: {
    position: 'absolute',
    width: SIZE_CAMERA + sizes.SIZE_15,
    height: SIZE_CAMERA + sizes.SIZE_15,
  },
  wrapConnerTopLeft: {
    position: 'absolute',
    top: sizes.ZERO,
    left: sizes.ZERO,
  },
  wrapConnerTopRight: {
    position: 'absolute',
    top: sizes.ZERO,
    right: sizes.ZERO,
    transform: [{rotate: '90deg'}],
  },
  wrapConnerBottomRight: {
    position: 'absolute',
    bottom: sizes.ZERO,
    right: sizes.ZERO,
    transform: [{rotate: '180deg'}],
  },
  wrapConnerBottomLeft: {
    position: 'absolute',
    bottom: sizes.ZERO,
    left: sizes.ZERO,
    transform: [{rotate: '270deg'}],
  },
  barMarkerOne: {
    height: sizes.SIZE_3,
    width: SIZE_BAR_MARKER,
    backgroundColor: 'white',
  },
  barMarkerTwo: {
    height: SIZE_BAR_MARKER - sizes.SIZE_3,
    width: sizes.SIZE_3,
    backgroundColor: 'white',
  },
  iconFlash: {
    alignSelf: 'center',
    marginBottom: sizes.SIZE_15,
  },
});

export default ModalScanQRcode;
