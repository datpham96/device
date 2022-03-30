import React from 'react';
import {View} from 'react-native';
import images from '../../../config/images';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import {Button} from 'base';
import {useDispatch} from 'react-redux';
import {logoutRequest} from 'actions/loginActions';

const Error401 = () => {
  const dispatch = useDispatch();
  const handleRetry = async () => {
    dispatch(logoutRequest());
  };
  return (
    <View style={styles.container}>
      <FastImage style={styles.image} source={images.backgrounds.error_401} />
      <Button
        customStyle={styles.btn}
        onPress={handleRetry}
        label={'Quay lại Đăng nhập'}
      />
    </View>
  );
};

export default Error401;
