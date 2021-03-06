import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
//node_modules
import FastImage from 'react-native-fast-image';
import Validator from 'validatorjs';
import {useDispatch, useSelector} from 'react-redux';
//api
//base
import {Text, Button, Background, ButtonBack, Input} from 'base';
//components
import {Loading, TextError} from 'components';
//config
import {commonStyles, sizes} from 'styles';
import images from 'images';
//helpers
import {checkVar, flashMessage} from 'helpers/funcs';
//HOC
//hooks
//navigation
import * as RootNavigation from 'RootNavigation';
//storages
//redux-stores
import {registerRequest, registerReset} from 'actions/loginActions';
//feature
import styles from './styles';
//code-splitting
//screen
const Register = () => {
  const dispatch = useDispatch();
  const isLoadingRegister = useSelector(
    state => state?.auth?.isLoadingRegister,
  );
  const statusRegister = useSelector(state => state?.auth?.statusRegister);
  const dataErrors = useSelector(state => state?.auth?.errors);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errors, setErrors] = useState({});
  const [secureTextEntryPassword, setSecureTextEntryPassword] = useState(true);
  const [secureTextEntryRePassword, setSecureTextEntryRePassword] =
    useState(true);

  useEffect(() => {
    if (dataErrors && dataErrors?.msg) {
      flashMessage.error(dataErrors?.msg);
      dispatch(registerReset());
    }
  }, [dataErrors, dispatch]);

  useEffect(() => {
    if (statusRegister) {
      flashMessage.success('Đăng ký thành công');
      dispatch(registerReset());
      // RootNavigation.navigate(navigationTypes.statusSuccess.screen, {
      //   labelBtn: 'Quay lại đăng nhập',
      //   screenName: navigationTypes.login.screen,
      //   content: 'Bạn đã đăng ký tài khoản thành công !',
      // });
    }
  }, [statusRegister, dispatch]);

  const handleRegister = () => {
    const validation = new Validator(
      {
        name: name,
        phone: phone,
        password: password,
        rePassword: rePassword,
      },
      {
        name: 'required',
        phone: 'required|phone',
        password: 'required',
        rePassword: 'required',
      },
      {
        'required.name': 'Họ và tên không được bỏ trống',
        'required.phone': 'Số điện thoại không được bỏ trống',
        'phone.phone': 'Số điện thoại không đúng định dạng',
        'required.password': 'Mật khẩu không được bỏ trống',
        'required.rePassword': 'Nhập lại mật khẩu không được bỏ trống',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        name: validation.errors.first('name'),
        phone: validation.errors.first('phone'),
        password: validation.errors.first('password'),
        rePassword: validation.errors.first('rePassword'),
      });
      if (
        !validation.errors.first('password') &&
        !checkVar.isPassword(password)
      ) {
        setErrors({
          ...errors,
          password:
            'Mật khẩu phải lớn hơn 8 ký tự, ít nhất 1 ký tự viết hoa, ký tự thường, 1 ký tự đặc biệt và 1 số',
        });
        return;
      }
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        name: validation.errors.first('name'),
        phone: validation.errors.first('phone'),
        password: validation.errors.first('password'),
        rePassword: validation.errors.first('rePassword'),
      });
      if (!checkVar.isPassword(password)) {
        setErrors({
          ...errors,
          password:
            'Mật khẩu phải lớn hơn 8 ký tự, ít nhất 1 ký tự viết hoa, ký tự thường, 1 ký tự đặc biệt và 1 số',
          name: false,
          phone: false,
          rePassword: false,
        });
        return;
      } else {
        setErrors({
          ...errors,
          password: false,
        });
      }
    }

    if (password !== rePassword) {
      setErrors({
        ...errors,
        rePassword: 'Mật khẩu xác nhận không khớp',
        password: false,
        name: false,
        phone: false,
      });
      return;
    } else {
      setErrors({
        ...errors,
        rePassword: false,
        password: false,
        name: false,
        phone: false,
      });
    }

    //handle register
    dispatch(registerRequest(name, phone, password));
  };

  const handleRedirectLogin = () => {
    RootNavigation.goBack();
  };

  return (
    <Background isKeyboard bout>
      <Loading isLoading={isLoadingRegister} />
      <ButtonBack />
      <View style={styles.contentContainer}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={styles.logo}
          source={images.logos.main}
        />
        <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
          Đăng ký tài khoản
        </Text>
        <View style={styles.inputPhoneContainer}>
          <Input
            value={name}
            onChangeValue={val => setName(val)}
            placeholder="Nhập họ và tên"
            icon={images.icons.name}
          />
          {errors?.name && <TextError message={errors?.name} />}
        </View>
        <View style={styles.inputPasswordContainer}>
          <Input
            value={phone}
            onChangeValue={val => setPhone(val.replace(/[^0-9]/g, ''))}
            placeholder="Nhập số điện thoại"
            icon={images.icons.phone}
            props={{
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
              secureTextEntry: secureTextEntryPassword,
            }}
            placeholder="Nhập mật khẩu"
            icon={images.icons.key}
            onPressIcon={() =>
              setSecureTextEntryPassword(!secureTextEntryPassword)
            }
          />
          {errors?.password && <TextError message={errors?.password} />}
        </View>
        <View style={styles.inputPasswordContainer}>
          <Input
            value={rePassword}
            onChangeValue={val => setRePassword(val)}
            props={{
              secureTextEntry: secureTextEntryRePassword,
            }}
            placeholder="Nhập lại mật khẩu"
            icon={images.icons.key}
            onPressIcon={() =>
              setSecureTextEntryRePassword(!secureTextEntryRePassword)
            }
          />
          {errors?.rePassword && <TextError message={errors?.rePassword} />}
        </View>
        <Button
          onPress={handleRegister}
          customStyle={styles.btn}
          customLabelStyle={styles.labelBtn}
          label="Đăng ký"
        />
        <Text style={styles.titleNotAccount}>
          Bạn đã có tài khoản{' '}
          <Text onPress={handleRedirectLogin} style={styles.textRegister}>
            đăng nhập
          </Text>{' '}
          ngay !
        </Text>
      </View>
    </Background>
  );
};

export default Register;
