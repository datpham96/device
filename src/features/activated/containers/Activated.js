import React, {Suspense, useCallback, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
//node_modules
import Validator from 'validatorjs';
import moment from 'moment';
import {useMutation} from 'react-query';
//api
import {deviceLicenseKeyUpdateApi} from 'methods/device';
//base
import {Text, Background, Button, Input, ButtonBack} from 'base';
//components
import {TextError, Loading} from 'components';
//config
import {commonStyles} from 'styles';
//helpers
import {flashMessage} from 'src/helpers/funcs';
//HOC
//hooks
//navigation
import * as RootNavigation from 'RootNavigation';
//storages
//redux-stores
//feature
import styles from './styles';
//code-splitting
const PopupAlert = React.lazy(() =>
  import('src/components/Popups/PopupAlertComponent'),
);
//screen

const Activated = ({route}) => {
  const dataParams = route?.params;
  const [code, setCode] = useState(dataParams?.license_key);
  const [errors, setErrors] = useState({});
  const [visibleAlertSuccess, setVisibleAlertSuccess] = useState(false);

  const mutateDeviceLicenkeyUpdate = useMutation(
    ({data_device_id, data_lisence_key}) =>
      deviceLicenseKeyUpdateApi(data_device_id, data_lisence_key),
  );

  const expiredDate = useMemo(() => {
    let tmpObjExpiredDate = {
      expird_date: '00/00/0000',
      total_expird_date: 0,
    };
    if (dataParams?.license_key_expired) {
      let tmpExpiredDate = moment(
        dataParams?.license_key_expired,
        'YYYY-MM-DD HH:mm:ss',
      ).format('DD/MM/YYYY');
      let totalExpiredDate = moment(dataParams?.license_key_expired).diff(
        moment(),
        'days',
      );
      tmpObjExpiredDate.expird_date = tmpExpiredDate;
      tmpObjExpiredDate.total_expird_date = totalExpiredDate;
    }
    return tmpObjExpiredDate;
  }, [dataParams]);

  const handleUpdate = () => {
    const validation = new Validator(
      {
        code: code,
      },
      {
        code: 'required',
      },
      {
        'required.code': 'Bản quyền không hợp lệ vui lòng nhập lại',
      },
    );

    if (validation.fails()) {
      setErrors({...errors, code: validation.errors.first('code')});
      return;
    }

    if (validation.passes()) {
      setErrors({...errors, code: validation.errors.first('code')});
    }

    //update request
    mutateDeviceLicenkeyUpdate
      .mutateAsync({
        data_device_id: dataParams?.device_id,
        data_lisence_key: code,
      })
      .then(resp => {
        if (resp?.status) {
          setVisibleAlertSuccess(true);
        } else {
          flashMessage.error(resp?.msg);
        }
        mutateDeviceLicenkeyUpdate.reset();
      })
      .catch(err => {
        flashMessage.error(err?.msg);
      });
  };

  const handleRedirectChilrenInfo = () => {
    setVisibleAlertSuccess(false);
    RootNavigation.goBack();
  };

  return (
    <Background isKeyboard bout>
      <ButtonBack />
      <Loading isLoading={mutateDeviceLicenkeyUpdate?.isLoading} />
      <Suspense fallback={<></>}>
        {visibleAlertSuccess && (
          <PopupAlert
            content="Bản quyền của bạn đã kích hoạt thành công"
            onPressCancel={handleRedirectChilrenInfo}
            visible={visibleAlertSuccess}
          />
        )}
      </Suspense>
      <ScrollView style={styles.container}>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Bản quyền sử dụng
        </Text>
        <View style={styles.wrapDateNumber}>
          <Text style={styles.dateNumber}>
            {expiredDate?.total_expird_date}
          </Text>
          <Text style={styles.dateLabel}>Ngày</Text>
        </View>
        <Text style={styles.descriptionTime}>Thời gian sử dụng ứng dụng</Text>
        <View style={styles.wrapInput}>
          <Input
            customerInput={styles.customInput}
            value={code}
            onChangeValue={val => setCode(val)}
            placeholder="Nhập mã"
          />
          {errors?.code && <TextError message={errors?.code} />}
        </View>
        <View style={styles.wrapBtn}>
          <Button
            customStyle={styles.btn}
            onPress={handleUpdate}
            label="Lưu lại"
          />
        </View>
        <Text style={styles.expiredDate}>
          Ngày hết hạn: {expiredDate?.expird_date}
        </Text>
      </ScrollView>
    </Background>
  );
};

export default Activated;
