import React, {useState} from 'react';
import {Text, Input, Background, Button, ButtonBack} from 'base';
import {View, TouchableHighlight} from 'react-native';
import styles from './styles';
import {colors, commonStyles} from 'styles';
import {deviceActivationApi} from 'src/api/methods/device';
import {useMutation} from 'react-query';
import {TextError, Loading, ModalBarcode} from 'components';
import {Toast} from 'customs';
import Validator from 'validatorjs';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';

const ImeiManager = ({route}) => {
  const dataParams = route?.params;
  const [imei, setImei] = useState('');
  const [errors, setErrors] = useState({});
  const [visibleBarCode, setVisibleBarCode] = useState(false);

  const mutationActivatedDevice = useMutation(
    ({
      data_imei,
      data_device_info,
      data_name,
      data_birthday,
      data_gender,
      data_avatar,
    }) =>
      deviceActivationApi(
        data_imei,
        data_device_info,
        data_name,
        data_birthday,
        data_gender,
        data_avatar,
      ),
  );
  console.log(dataParams, 'dataParams');

  const handleDeviceActivation = () => {
    const validation = new Validator(
      {
        imei: imei,
      },
      {
        imei: 'required',
      },
      {
        'required.imei': 'Mã Imei không được bỏ trống',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        imei: validation.errors.first('imei'),
      });
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        imei: validation.errors.first('imei'),
      });
    }

    //handle code request
    mutationActivatedDevice
      .mutateAsync({
        data_imei: imei,
        data_device_info: dataParams?.deviceInfo,
        data_name: dataParams?.name,
        data_birthday: dataParams?.birthday,
        data_gender: dataParams?.gender,
        data_avatar: dataParams?.dataRequestAvatar,
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

  const onSuccessImei = val => {
    if (val) {
      setImei(val);
      setVisibleBarCode(false);
      setErrors({});
    }
  };

  return (
    <Background isKeyboard bout>
      <ModalBarcode
        visible={visibleBarCode}
        onPressClose={() => setVisibleBarCode(false)}
        onImei={val => onSuccessImei(val)}
      />
      <Loading isLoading={mutationActivatedDevice.isLoading} />
      <ButtonBack />
      <View style={styles.container}>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Quản lý mã IMEI
        </Text>
        <View style={styles.wrapInputImei}>
          <Input
            placeholder="Nhập mã IMEI"
            value={imei}
            onChangeValue={val => setImei(val)}
            iconComponent={
              <TouchableHighlight
                underlayColor={colors.COLOR_UNDERLAY_BLUE}
                activeOpacity={0.9}
                onPress={() => setVisibleBarCode(true)}
                style={styles.wrapBtnIcon}>
                <Text style={styles.labelBtnIcon}>Quét imei</Text>
              </TouchableHighlight>
            }
          />
          {errors?.imei && <TextError message={errors?.imei} />}
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

export default ImeiManager;
