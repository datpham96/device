import React, {useState, useEffect} from 'react';
import {TextError, Loading} from 'components';
import {Text, Button, Background, Input} from 'base';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from 'images';
import styles from './styles';
import {commonStyles, sizes} from 'styles';
import {useDispatch, useSelector} from 'react-redux';
import {loginRequest, loginReset} from 'actions/loginActions';
import Validator from 'validatorjs';
import {Toast} from 'customs';
import lodash from 'lodash';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const loginErrors = useSelector(state => state.auth.errors, lodash.isEqual);
  const isLoadingLogin = useSelector(state => state.auth.isLoadingLogin);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setErrors({});
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  useEffect(() => {
    if (loginErrors && loginErrors?.msg) {
      Toast(loginErrors?.msg);
      dispatch(loginReset());
    }
  }, [loginErrors, dispatch]);

  const handleLogin = () => {
    let validation = new Validator(
      {
        phone: phone,
        password: password,
      },
      {
        phone: 'required|phone',
        password: 'required',
      },
      {
        'required.phone': 'Số điện thoại không được bỏ trống',
        'phone.phone': 'Số điện thoại không đúng định dạng',
        'required.password': 'Mật khẩu không được bỏ trống',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        phone: validation.errors.first('phone'),
        password: validation.errors.first('password'),
      });
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        phone: validation.errors.first('phone'),
        password: validation.errors.first('password'),
      });
    }
    dispatch(loginRequest(phone, password));
  };

  const handleRedirectRegister = () => {
    RootNavigation.navigate(navigationTypes.register.screen);
  };

  const handleRedirectFogotPassword = () => {
    RootNavigation.navigate(navigationTypes.fogotPassword.screen);
  };

  return (
    <Background isKeyboard bout>
      <Loading isLoading={isLoadingLogin} />
      <View style={styles.contentContainer}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={styles.logo}
          source={images.logos.main}
        />
        <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
          Đăng nhập tài khoản
        </Text>
        <View style={styles.inputPhoneContainer}>
          <Input
            value={phone}
            onChangeValue={val => setPhone(val.replace(/[^0-9]/g, ''))}
            placeholder="Nhập số điện thoại"
            icon={images.icons.phone}
            props={{
              keyboardType: 'number-pad',
              maxLength: sizes.SIZE_10,
            }}
          />
          {errors?.phone && <TextError message={errors?.phone} />}
        </View>
        <View style={styles.inputPasswordContainer}>
          <Input
            value={password}
            onChangeValue={val => setPassword(val)}
            props={{
              secureTextEntry: true,
            }}
            placeholder="Nhập mật khẩu"
            icon={images.icons.key}
          />
          {errors?.password && <TextError message={errors?.password} />}
        </View>
        <Text
          style={styles.btnFotgotPassword}
          onPress={handleRedirectFogotPassword}>
          Quên mật khẩu ?
        </Text>
        <Button
          onPress={handleLogin}
          customStyle={styles.btn}
          customLabelStyle={styles.labelBtn}
          label="Đăng nhập"
        />
        <Text style={styles.titleNotAccount}>
          Bạn chưa có tài khoản{' '}
          <Text onPress={handleRedirectRegister} style={styles.textRegister}>
            đăng ký
          </Text>{' '}
          ngay!
        </Text>
      </View>
    </Background>
  );
};

export default Login;
