import React, {useState} from 'react';
import {Text, Input, Background, Button, ButtonBack} from 'base';
import {View} from 'react-native';
import styles from './styles';
import {commonStyles} from 'styles';
import {deviceActivationApi} from 'src/api/methods/device';
import {useMutation} from 'react-query';
import {TextError, Loading, ModalBarcode} from 'components';
import {Toast} from 'customs';
import Validator from 'validatorjs';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';

const Imei = ({route}) => {
  const dataParams = route?.params;
  const [licenseKey, setLicenseKey] = useState('');
  const [errors, setErrors] = useState({});
  // const [visibleBarCode, setVisibleBarCode] = useState(false);

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
          Toast(resp?.msg);
          RootNavigation.navigate(navigationTypes.childrenManager.screen);
        } else {
          Toast(resp?.msg);
        }
        mutationActivatedDevice.reset();
      })
      .catch(err => {
        Toast(err?.msg);
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
