import React from 'react';
import {View} from 'react-native';
//node_modules
import {useDispatch} from 'react-redux';
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
//storages
//redux-stores
import {logoutRequest} from 'actions/loginActions';
//feature
import styles from './styles';
//code-splitting
//screen
const Error401 = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const handleRetry = async () => {
    await queryClient.refetchQueries({stale: true});
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
