import React from 'react';
import {View} from 'react-native';
//node_modules
import LottieView from 'lottie-react-native';
import {useQueryClient} from 'react-query';
//api
//base
import {Background, Button, Text} from 'base';
//components
//config
import {commonStyles} from 'styles';
//helpers
//HOC
//hooks
//navigation
import * as RootNavigation from 'RootNavigation';
//storages
//redux-stores
//feature
import styles from './styles';
//code-splitting
//screen
const Error = () => {
  const queryClient = useQueryClient();
  const handleRetry = async () => {
    await queryClient.refetchQueries({stale: true});
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
