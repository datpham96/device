import React, {Suspense, useCallback, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
//node_modules
import FastImage from 'react-native-fast-image';
import Validator from 'validatorjs';
import moment from 'moment';
import {useMutation} from 'react-query';
import {
  requestMultiple,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
//api
import {
  deviceActivationApi,
  deviceUpdateApi,
  deviceAvatarUpdateApi,
} from 'methods/device';
//base
import {Text, Input, Background, Button, ButtonBack} from 'base';
//components
import {
  InputDateComponent,
  InputSelectComponent,
  TextError,
  Loading,
} from 'components';
//config
import {colors, commonStyles} from 'styles';
import images from 'images';
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
import {genders} from 'types';
//code-splitting
const ModalWaiting = React.lazy(() =>
  import('src/components/Modals/ModalWaitingComponent'),
);
const PopupConfirm = React.lazy(() =>
  import('src/components/Popups/PopupConfirmComponent'),
);
const ModalCameraBottomSheet = React.lazy(() =>
  import('src/components/Modals/ModalCameraBottomSheetComponent'),
);
//screen

const DeviceInfo = ({route}) => {
  const deviceInfo = route?.params?.device_info;
  const deviceId = route?.params?.device_id;
  const deviceName = deviceInfo?.ManufacturerName;
  const childrenName = route?.params?.children_name;
  const [avatarUri, setAvatarUri] = useState('');
  const [dataRequestAvatar, setDataRequestAvatar] = useState('');
  const [name, setName] = useState(childrenName);
  const [birthday, setBirthday] = useState(moment().format('DD/MM/YYYY'));
  const [gender, setGender] = useState(1);
  const [errors, setErrors] = useState({});
  const [visibleImagePicker, setVisibleImagePicker] = useState(false);
  const [visiblePermissionCamera, setVisiblePermissionCamera] = useState(false);
  const [visibleWaitingModal, setVisibleWaitingModal] = useState(false);

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

  //c???p nh???t device info
  const mutationDeviceUpdate = useMutation(
    ({
      data_device_id,
      data_is_block,
      data_full_name,
      data_birthday,
      data_gender,
    }) =>
      deviceUpdateApi(
        data_device_id,
        data_is_block,
        data_full_name,
        data_birthday,
        data_gender,
      ),
  );

  //c???p nh???t device avatar
  const mutationDeviceAvatarUpdate = useMutation(
    ({data_device_id, data_avatar}) =>
      deviceAvatarUpdateApi(data_device_id, data_avatar),
  );

  const handleOpenBottomSheetImagePicker = () => {
    //request permission camera
    requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.ANDROID.CAMERA]).then(
      result => {
        if (
          result[PERMISSIONS.IOS.CAMERA] === RESULTS.BLOCKED ||
          result[PERMISSIONS.IOS.CAMERA] === RESULTS.DENIED ||
          result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.BLOCKED ||
          result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.DENIED
        ) {
          setVisiblePermissionCamera(true);
        }
        if (
          result[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED ||
          result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED
        ) {
          setVisibleImagePicker(true);
          setVisiblePermissionCamera(false);
        }
      },
    );
  };

  const handleUpdateInfo = () => {
    let validation = new Validator(
      {
        fullName: name,
        gender: gender,
        birthday: birthday,
      },
      {
        fullName: 'required',
        gender: 'required',
        birthday: 'required',
      },
      {
        'required.fullName': 'T??n kh??ng ???????c b??? tr???ng',
        'required.gender': 'Gi???i t??nh kh??ng ???????c b??? tr???ng',
        'required.birthday': 'Ng??y sinh kh??ng ???????c b??? tr???ng',
      },
    );
    if (validation.fails()) {
      setErrors({
        ...errors,
        name: validation.errors.first('name'),
        gender: validation.errors.first('gender'),
        birthday: validation.errors.first('birthday'),
      });
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        name: validation.errors.first('name'),
        gender: validation.errors.first('gender'),
        birthday: validation.errors.first('birthday'),
      });
    }
    //c???p nh???t avatar
    mutationDeviceAvatarUpdate
      .mutateAsync({
        data_device_id: deviceId,
        data_avatar: dataRequestAvatar,
      })
      .then(() => {
        return mutationDeviceUpdate.mutateAsync({
          data_device_id: deviceId,
          data_is_block: 0,
          data_full_name: name,
          data_birthday: birthday
            ? moment(birthday, 'DD/MM/YYYY').format('YYYY-MM-DD')
            : '',
          data_gender: gender,
        });
      })
      .then(resp => {
        if (resp?.status) {
          RootNavigation.navigate(navigationTypes.childrenManager.screen);
          flashMessage.success('C???p nh???t th??ng tin th??nh c??ng');
        } else {
          flashMessage.error('C???p nh???t th??ng tin th???t b???i');
        }
        mutationDeviceAvatarUpdate.reset();
        mutationDeviceUpdate.reset();
      })
      .catch(err => {
        mutationDeviceAvatarUpdate.reset();
        mutationDeviceUpdate.reset();
        flashMessage.error(err?.msg);
      });
  };

  const handleSetting = useCallback(() => {
    setVisiblePermissionCamera(false);
    openSettings().catch(() => console.warn('cannot open settings'));
  }, []);

  return (
    <Background isKeyboard bout>
      <Suspense fallback={<></>}>
        {visibleWaitingModal && (
          <ModalWaiting
            onPressCancel={() => {
              setVisibleWaitingModal(false);
              RootNavigation.navigate(navigationTypes.childrenManager.screen);
            }}
            visible={visibleWaitingModal}
          />
        )}
        {visiblePermissionCamera && (
          <PopupConfirm
            labelBtnLeft="C??i ?????t"
            labelBtnRight="Hu???"
            visible={visiblePermissionCamera}
            content={
              'SafeZone mu???n truy c???p m??y ???nh c???a b???n ????? ch???p ???nh, vui l??ng cho ph??p truy c???p m??y ???nh c???a b???n \n Settings > SafeZone > Camera'
            }
            onPressCancel={() => {
              setVisiblePermissionCamera(false);
            }}
            onPressAgree={handleSetting}
          />
        )}
        {visibleImagePicker && (
          <ModalCameraBottomSheet
            setDataRequestAvatar={data => setDataRequestAvatar(data)}
            setAvatarUri={data => setAvatarUri(data)}
            onPressCancel={() => setVisibleImagePicker(false)}
            visible={visibleImagePicker}
            onPressClose={() => setVisibleImagePicker(false)}
          />
        )}
      </Suspense>
      <Loading isLoading={mutationActivatedDevice?.isLoading} />
      <ButtonBack />
      <View style={styles.container}>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Qu???n l?? th??ng tin tr???
        </Text>
        <TouchableOpacity
          onPress={handleOpenBottomSheetImagePicker}
          activeOpacity={0.9}
          style={styles.wrapSelectAvatar}>
          {avatarUri ? (
            <FastImage style={styles.avatar} source={avatarUri} />
          ) : (
            <FastImage
              style={styles.iconAvatar}
              source={images.icons.select_avatar}
            />
          )}
        </TouchableOpacity>
        <View style={styles.wrapInput}>
          <Input
            value={name}
            onChangeValue={val => setName(val)}
            placeholder="H??? v?? t??n tr???"
          />
          {errors?.name && <TextError message={errors?.name} />}
        </View>
        <View style={styles.wrapInput}>
          <Input
            value={deviceName}
            customerInput={{backgroundColor: colors.COLOR_DISABLE}}
            containerInput={{backgroundColor: colors.COLOR_DISABLE}}
            props={{editable: false}}
            placeholder="T??n thi???t b???"
          />
        </View>
        <View style={styles.wrapInputDateGender}>
          <View style={styles.wrapInputDate}>
            <InputDateComponent
              value={birthday}
              onDateChange={date => setBirthday(date)}
            />
            {errors?.birthday && <TextError message={errors?.birthday} />}
          </View>
          <View style={styles.wrapInputGender}>
            <InputSelectComponent
              selectedValue={gender}
              onDonePress={val => setGender(val)}
              placeholder="--Gi???i t??nh--"
              listData={genders}
            />
            {errors?.gender && <TextError message={errors?.gender} />}
          </View>
        </View>
        <Button
          customStyle={styles.btn}
          label="L??u l???i"
          onPress={handleUpdateInfo}
        />
      </View>
    </Background>
  );
};

export default DeviceInfo;
