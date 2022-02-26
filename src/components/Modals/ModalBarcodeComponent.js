import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {colors, sizes, fonts} from 'styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import metrics from 'metrics';
// import SoundPlayer from 'react-native-sound-player';

const {width, height} = Dimensions.get('window');

const ModalBarcodeComponent = ({visible = 'false', onPressClose, onImei}) => {
  const insets = useSafeAreaInsets();
  // const [imeiByBarcode, setImeiByBarcode] = useState('');

  // useEffect(() => {
  //   if (imeiByBarcode) {
  //     console.log(1111);
  //     playSong();
  //     return;
  //   }
  // }, [imeiByBarcode]);

  // useEffect(() => {
  //   SoundPlayer.onFinishedLoading((success: boolean) => {
  //     // console.log('finished loading', success)
  //   });
  // }, []);

  // const playSong = () => {
  //   SoundPlayer.loadSoundFile('beep', 'mp3');
  //   SoundPlayer.setVolume(1.5);
  //   SoundPlayer.playSoundFile('beep', 'mp3');
  // };

  const onBarCodeRead = result => {
    if (result && result.data) {
      // setImeiByBarcode(result.data);
      onImei(result.data);
    }
  };

  return (
    <Modal animationType={'slide'} transparent={true} visible={visible}>
      <View style={[styles.container, {top: insets.top}]}>
        <View style={styles.background} />
        <View style={styles.containerContent}>
          <TouchableOpacity
            style={styles.close}
            activeOpacity={0.8}
            onPress={onPressClose}>
            <MaterialCommunityIcons
              name="close"
              size={sizes.SIZE_22}
              color={colors.COLOR_WHITE}
            />
          </TouchableOpacity>
          <RNCamera
            style={styles.wrapCamera}
            onBarCodeRead={onBarCodeRead}
            aspect={RNCamera.Constants.fill}
            backgroundColor={colors.COLOR_BLACK}>
            <BarcodeMask
              edgeBorderWidth={2}
              width={metrics.screenWidth * 0.9}
              height={(metrics.screenWidth * 0.9 * 9) / 16}
              lineAnimationDuration={1000}
              animatedLineColor={'transparent'}
              useNativeDriver={true}
            />
          </RNCamera>
          <View style={styles.wrapTextTop}>
            <Text style={styles.textTop}>
              Di chuyển camera đến vùng{'\n'}chứa mã vạch để quét
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    backgroundColor: colors.COLOR_BLACK,
    opacity: 0.4,
  },
  containerContent: {
    alignItems: 'center',
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    backgroundColor: colors.COLOR_WHITE,
    position: 'absolute',
    paddingBottom: sizes.SIZE_10,
  },
  close: {
    marginTop: sizes.SIZE_5,
    marginRight: sizes.SIZE_10,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: sizes.SIZE_5,
    top: sizes.SIZE_5,
    zIndex: 11,
  },
  wrapCamera: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    position: 'relative',
    zIndex: sizes.ZERO,
  },
  wrapTextTop: {
    position: 'absolute',
    alignSelf: 'center',
    top: '23%',
  },
  textTop: {
    color: colors.COLOR_WHITE,
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    fontSize: sizes.SIZE_16,
    textAlign: 'center',
  },
});

export default ModalBarcodeComponent;
