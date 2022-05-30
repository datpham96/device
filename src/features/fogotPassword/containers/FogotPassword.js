import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
//node_modules
import Validator from 'validatorjs';
import {useDispatch, useSelector} from 'react-redux';
//api
//base
import {Text, Button, Background, ButtonBack, Input} from 'base';
//components
import {TextError, Loading} from 'components';
//config
import images from 'images';
import {commonStyles, sizes} from 'styles';
//helpers
import {flashMessage} from 'helpers/funcs';
//HOC
//hooks
//navigation
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
//storages
//redux-stores
import {fogotPasswordRequest, fogotPasswordReset} from 'actions/loginActions';
//feature
import styles from './styles';
//code-splitting
//screen
const FogotPassword = () => {
  const dispatch = useDispatch();
  const isLoadingFogotPassword = useSelector(
    state => state?.auth?.isLoadingFogotPassword,
  );
  const statusFogotPassword = useSelector(
    state => state?.auth?.statusFogotPassword,
  );
  const dataErrors = useSelector(state => state?.auth?.errors);
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dataErrors && dataErrors?.msg) {
      flashMessage.error(dataErrors?.msg);
      dispatch(fogotPasswordReset());
    }
  }, [dataErrors, dispatch]);

  useEffect(() => {
    if (statusFogotPassword) {
      flashMessage.success('Gửi OTP thành công');
      dispatch(fogotPasswordReset());
      RootNavigation.navigate(navigationTypes.otpNewPassword.screen);
    }
  }, [statusFogotPassword, dispatch]);

  const handleSend = () => {
    let validation = new Validator(
      {
        phone: phone,
      },
      {
        phone: 'required|phone',
      },
      {
        'required.phone': 'Số điện thoại không được bỏ trống',
        'phone.phone': 'Số điện thoại không đúng định dạng',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        phone: validation.errors.first('phone'),
      });
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        phone: validation.errors.first('phone'),
      });
    }

    dispatch(fogotPasswordRequest(phone));
  };

  return (
    <Background isKeyboard bout>
      <ButtonBack />
      <Loading isLoading={isLoadingFogotPassword} />
      <View style={styles.contentContainer}>
        <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
          Nhập số điện thoại
        </Text>
        <View style={styles.inputPhoneContainer}>
          <Input
            props={{
              keyboardType: 'number-pad',
              maxLength: sizes.SIZE_10,
            }}
            value={phone}
            onChangeValue={val => setPhone(val.replace(/[^0-9]/g, ''))}
            placeholder="Nhập số điện thoại"
            icon={images.icons.phone}
          />
          {errors?.phone && <TextError message={errors?.phone} />}
        </View>
        <Button
          onPress={handleSend}
          customStyle={styles.btn}
          customLabelStyle={styles.labelBtn}
          label="Gửi đi"
        />
      </View>
    </Background>
  );
};

export default FogotPassword;
