import React from 'react';
import {View} from 'react-native';
import images from '../../../config/images';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import {Button} from 'base';
import * as RootNavigation from '../../../navigation/RootNavigation';

const Error = () => {
  const handleRetry = async () => {
    RootNavigation.goBack();
  };
  return (
    <View style={styles.container}>
      <FastImage style={styles.image} source={images.backgrounds.error_500} />
      <Button
        customStyle={styles.btn}
        onPress={handleRetry}
        label={'Thử lại'}
      />
    </View>
  );
};

export default Error;
