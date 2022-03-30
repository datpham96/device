import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {Background, Button, Text} from 'base';
import {useDispatch} from 'react-redux';
import {logoutRequest} from 'actions/loginActions';
import LottieView from 'lottie-react-native';
import {commonStyles} from 'styles';

const Error401 = () => {
  const dispatch = useDispatch();
  const handleRetry = async () => {
    dispatch(logoutRequest());
  };
  return (
    <Background bin customerBackgroundImage={styles.container}>
      <View style={styles.wrapLottie401}>
        <LottieView
          style={commonStyles.flex1}
          autoSize={true}
          resizeMode="contain"
          source={require('../../../config/animations/401.json')}
          autoPlay
          loop
          speed={2}
        />
      </View>
      <Text style={styles.content}>{'Phiên đăng nhập đã hết hạn'}</Text>
      <Button
        customStyle={styles.btn}
        onPress={handleRetry}
        label={'Quay lại Đăng nhập'}
      />
    </Background>
  );
};

export default Error401;
