import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
//node_modules
import Validator from 'validatorjs';
import {useDispatch, useSelector} from 'react-redux';
//api
//base
import {Text, Button, Background, ButtonBack} from 'base';
//components
import {InputComponent, TextError, Loading} from 'components';
//config
import images from 'images';
import {commonStyles} from 'styles';
//helpers
import {flashMessage} from 'helpers/funcs';
//HOC
//hooks
//navigation
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
//storages
//redux-stores
import {verifyOtpRequest, verifyOtpReset} from 'actions/loginActions';
//feature
import styles from './styles';
//code-splitting
//screen

const Otp = () => {
  const dispatch = useDispatch();
  const isLoadingVerifyOtp = useSelector(
    state => state.auth.isLoadingVerifyOtp,
  );
  const statusVerifyOtp = useSelector(state => state?.auth?.statusVerifyOtp);
  const dataErrors = useSelector(state => state?.auth?.errors);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dataErrors && dataErrors?.msg) {
      flashMessage.error(dataErrors?.msg);
      dispatch(verifyOtpReset());
    }
  }, [dataErrors, dispatch]);

  useEffect(() => {
    if (statusVerifyOtp) {
      flashMessage.success('Xác thực OTP thành công');
      dispatch(verifyOtpReset());
      RootNavigation.navigate(navigationTypes.otpNewPassword.screen);
    }
  }, [statusVerifyOtp, dispatch]);

  const handleOtp = () => {
    let validation = new Validator(
      {
        otp: otp,
      },
      {
        otp: 'required|code',
      },
      {
        'required.otp': 'OTP không được bỏ trống',
        'code.otp': 'OTP không đúng định dạng',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        otp: validation.errors.first('otp'),
      });
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        otp: validation.errors.first('otp'),
      });
    }

    dispatch(verifyOtpRequest(otp));
  };
  return (
    <Background isKeyboard bout>
      <ButtonBack />
      <Loading isLoading={isLoadingVerifyOtp} />
      <View style={styles.contentContainer}>
        <Text style={[commonStyles.mainTitle, styles.mainTitle]}>Nhập mã</Text>
        <View style={styles.inputPhoneContainer}>
          <InputComponent
            onChangeValue={val => setOtp(val.replace(/[^0-9]/g, ''))}
            value={otp}
            placeholder="Nhập mã OTP"
            icon={images.icons.otp_outline}
          />
          {errors?.otp && <TextError message={errors?.otp} />}
        </View>
        <Button onPress={handleOtp} customStyle={styles.btn} label="Gửi đi" />
      </View>
    </Background>
  );
};

export default Otp;
