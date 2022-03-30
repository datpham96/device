import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {Background, Button, Text} from 'base';
import * as RootNavigation from '../../../navigation/RootNavigation';
import LottieView from 'lottie-react-native';
import {commonStyles} from 'styles';

const Error = () => {
  const handleRetry = async () => {
    RootNavigation.goBack();
  };
  return (
    <Background bin customerBackgroundImage={styles.container}>
      <View style={styles.wrapLottie}>
        <LottieView
          style={commonStyles.flex1}
          autoSize={true}
          resizeMode="contain"
          source={require('../../../config/animations/500.json')}
          autoPlay
          loop
        />
      </View>
      <Text style={styles.content}>
        {'Lỗi hệ thống \n Xin vui lòng thử lại!'}
      </Text>
      <Button
        customStyle={styles.btn}
        onPress={handleRetry}
        label={'Thử lại'}
      />
    </Background>
  );
};

export default Error;
