import React, {useState} from 'react';
import {View} from 'react-native';
//node_modules
import {useMutation} from 'react-query';
import Validator from 'validatorjs';
//api
import {deviceActivationApi} from 'methods/device';
//base
import {Text, Input, Background, Button, ButtonBack} from 'base';
//components
import {TextError, Loading} from 'components';
//config
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
//feature
import styles from './styles';
//code-splitting
//screen

const Imei = ({route}) => {
  const dataParams = route?.params;
  const [licenseKey, setLicenseKey] = useState('');
  const [errors, setErrors] = useState({});

  const mutationActivatedDevice = useMutation(
    ({
      data_imei,
      data_device_info,
      data_name,
      data_birthday,
      data_gender,
      data_avatar,
      data_license,
    }) =>
      deviceActivationApi(
        data_imei,
        data_device_info,
        data_name,
        data_birthday,
        data_gender,
        data_avatar,
        data_license,
      ),
  );

  const handleDeviceActivation = () => {
    const validation = new Validator(
      {
        licenseKey: licenseKey,
      },
      {
        licenseKey: 'required',
      },
      {
        'required.licenseKey': 'Mã kích hoạt không được bỏ trống',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        licenseKey: validation.errors.first('licenseKey'),
      });
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        licenseKey: validation.errors.first('licenseKey'),
      });
    }

    //handle code request
    mutationActivatedDevice
      .mutateAsync({
        data_imei: dataParams?.imei,
        data_device_info: dataParams?.deviceInfo,
        data_name: dataParams?.name,
        data_birthday: dataParams?.birthday,
        data_gender: dataParams?.gender,
        data_avatar: dataParams?.dataRequestAvatar,
        data_license: licenseKey,
      })
      .then(resp => {
        if (resp.status) {
          flashMessage.success(resp?.msg);
          RootNavigation.navigate(navigationTypes.childrenManager.screen);
        } else {
          flashMessage.success(resp?.msg);
        }
        mutationActivatedDevice.reset();
      })
      .catch(err => {
        flashMessage.error(err?.msg);
        mutationActivatedDevice.reset();
      });
  };

  return (
    <Background isKeyboard bout>
      <Loading isLoading={mutationActivatedDevice.isLoading} />
      <ButtonBack />
      <View style={styles.container}>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Bản quyền sử dụng
        </Text>
        <View style={styles.wrapInputImei}>
          <Input
            placeholder="Nhập mã bản quyền"
            value={licenseKey}
            onChangeValue={val => setLicenseKey(val)}
          />
          {errors?.licenseKey && <TextError message={errors?.licenseKey} />}
        </View>
        <Button
          customStyle={styles.btn}
          label="Kích hoạt"
          onPress={handleDeviceActivation}
        />
      </View>
    </Background>
  );
};

export default Imei;
