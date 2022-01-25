import React, {useState, useEffect} from 'react';
import {Text, Button, Background, ButtonBack, Input} from 'base';
import {View} from 'react-native';
import images from 'images';
import styles from './styles';
import {commonStyles} from 'styles';
import Validator from 'validatorjs';
import {TextError, Loading} from 'components';
import {useDispatch, useSelector} from 'react-redux';
import {Toast} from 'customs';
import {fogotPasswordRequest, fogotPasswordReset} from 'actions/loginActions';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';

const FogotPassword = () => {
  const dispatch = useDispatch();
  const isLoadingFogotPassword = useSelector(
    state => state.auth.isLoadingFogotPassword,
  );
  const statusFogotPassword = useSelector(
    state => state.auth.statusFogotPassword,
  );
  const dataErrors = useSelector(state => state.auth.errors);
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dataErrors && dataErrors?.msg) {
      Toast(dataErrors?.msg);
      dispatch(fogotPasswordReset());
    }
  }, [dataErrors, dispatch]);

  useEffect(() => {
    if (statusFogotPassword) {
      Toast('Gửi OTP thành công');
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
