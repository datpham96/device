import React, {useEffect, useRef, useState} from 'react';
import {View, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import {colors, commonStyles, sizes} from 'styles';
import metrics from 'metrics';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Text} from 'base';
import {Toast} from 'customs';
import FastImage from 'react-native-fast-image';
import images from 'images';

const CONTENT_WAITING = 'Đang xử lý';
const CONTENT_CONNECTION = 'Đang kết nối';

const ModalWaitingComponent = ({onPressCancel, visible = false}) => {
  const timeIntervalRef = useRef(null);
  const [timer, setTimer] = useState(10);
  const [waitingThreeDot, setWaitingThreeDot] = useState('');
  useEffect(() => {
    if (visible) {
      timeIntervalRef.current = setInterval(() => {
        if (timer > 0) {
          setTimer(prev => prev - 1);
        } else {
          onPressCancel();
          clearInterval(timeIntervalRef.current);
          setWaitingThreeDot('');
          Toast('Quá trình kết nối hoàn tất');
        }
        setWaitingThreeDot(prev => prev + '.');
      }, 1000);
      if (waitingThreeDot.length === 3) {
        setWaitingThreeDot('');
      }

      return () => {
        clearInterval(timeIntervalRef.current);
      };
    } else {
      setTimer(10);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, visible]);

  return (
    <Modal
      onRequestClose={onPressCancel}
      animationType="none"
      transparent={true}
      visible={visible}>
      <View style={styles.backgroundModal} />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {timer <= 1 && (
            <TouchableOpacity
              style={styles.wrapClose}
              activeOpacity={0.8}
              onPress={onPressCancel}>
              <FastImage style={styles.iconClose} source={images.icons.close} />
            </TouchableOpacity>
          )}
          <View style={styles.wrapLottie}>
            <LottieView
              style={commonStyles.flex1}
              autoSize={true}
              resizeMode="contain"
              source={require('../../config/animations/waitting.json')}
              autoPlay
              loop
            />
          </View>
          <View style={styles.mainTitle}>
            {/* <Text style={[commonStyles.mainTitle]}>Kích hoạt thành công</Text> */}
            <Text style={styles.textAwait}>
              {timer <= 5 ? CONTENT_CONNECTION : CONTENT_WAITING}{' '}
              {waitingThreeDot}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backgroundModal: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    backgroundColor: colors.COLOR_BLACK,
    position: 'absolute',
    opacity: 0.5,
    zIndex: 0,
  },
  container: {
    ...commonStyles.flex1,
    ...commonStyles.center,
  },
  contentContainer: {
    backgroundColor: colors.COLOR_DARK_BLUE,
    width: metrics.screenWidth - sizes.SIZE_30,
    height: wp('90%'),
    alignItems: 'center',
    borderRadius: sizes.SIZE_15,
  },
  wrapLottie: {
    width: wp('45%'),
    height: wp('60%'),
    position: 'absolute',
  },
  mainTitle: {
    position: 'absolute',
    bottom: wp('13%'),
  },
  textAwait: {
    textAlign: 'center',
    marginTop: sizes.SIZE_10,
    fontSize: sizes.SIZE_16,
  },
  wrapClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
    position: 'absolute',
    right: sizes.SIZE_10,
    top: sizes.SIZE_10,
  },
  iconClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
  },
});

export default ModalWaitingComponent;
