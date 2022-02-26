import React from 'react';
import {Background, Text} from 'base';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import images from 'images';
import FastImage from 'react-native-fast-image';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {commonStyles, sizes} from 'styles';
import metrics from 'metrics';
import {isIphoneX} from 'react-native-iphone-x-helper';
// import Modal from 'react-native-modal';

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
  return (
    <Modal animationType="fade" style={styles.modalContainer} visible={visible}>
      <Background bout>
        <TouchableOpacity
          style={styles.wrapClose}
          activeOpacity={0.8}
          onPress={onPressClose}>
          <FastImage style={styles.iconClose} source={images.icons.close} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <QRCodeScanner
            onRead={onSuccessQRCode}
            cameraStyle={styles.cameraStyles}
            topContent={<Text>Quét mã QR</Text>}
            cameraProps={{ratio: '1:1'}}
            // showMarker={true}
            bottomContent={
              <View>
                {/* <FastImage
                  style={styles.iconCamera}
                  source={images.icons.camera}
                /> */}
                <Text>Di chuyển camera đến gần mã QR code</Text>
              </View>
            }
          />
        </View>
      </Background>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: metrics.screenWidth,
  },
  wrapClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
    position: 'absolute',
    right: sizes.SIZE_20,
    top:
      Platform.OS === 'ios'
        ? metrics.statusBarHeight + sizes.SIZE_10
        : sizes.SIZE_10,
  },
  iconClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
  },
  contentContainer: {
    marginTop: sizes.SIZE_50,
    ...commonStyles.flex1,
  },
  //camera qrCode
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  cameraStyles: {
    width: metrics.screenWidth * 0.6,
    height: metrics.screenWidth * 0.6,
    alignSelf: 'center',
    borderRadius: sizes.SIZE_20,
  },
  iconCamera: {
    width: sizes.SIZE_35,
    height: sizes.SIZE_35,
    alignSelf: 'center',
    marginBottom: sizes.SIZE_15,
  },
});

export default ModalScanQRcode;
