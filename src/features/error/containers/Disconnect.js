import React from 'react';
import {View} from 'react-native';
import images from '../../../config/images';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import {Background, Button, Text} from 'base';
import * as RootNavigation from 'RootNavigation';
import LottieView from 'lottie-react-native';
import {commonStyles} from 'styles';

const Disconnect = () => {
  const handleRetry = () => {
    RootNavigation.goBack();
  };
  return (
    <Background bin customerBackgroundImage={styles.container}>
      <View style={styles.wrapLottie}>
        <LottieView
          style={commonStyles.flex1}
          autoSize={true}
          resizeMode="contain"
          source={require('../../../config/animations/disconnect.json')}
          autoPlay
          loop
        />
      </View>
      <Text style={styles.content}>
        {'Lỗi kết nối \n Xin vui lòng thử lại!'}
      </Text>
      <Button customStyle={styles.btn} onPress={handleRetry} label="Thử lại" />
    </Background>
  );
};

export default Disconnect;
