import React, {useState} from 'react';
import {Text, Input, Background, Button, ButtonBack} from 'base';
import {View, TouchableOpacity, Platform} from 'react-native';
import styles from './styles';
import {colors, commonStyles} from 'styles';
import FastImage from 'react-native-fast-image';
import {
  InputDateComponent,
  InputSelectComponent,
  TextError,
  ModalBottomSheet,
  PopupConfirm,
  Loading,
} from 'components';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import Validator from 'validatorjs';
import moment from 'moment';
import images from 'images';
import {useMutation} from 'react-query';
import {
  deviceActivationApi,
  deviceUpdateApi,
  deviceAvatarUpdateApi,
} from 'src/api/methods/device';
import {Toast} from 'customs';
import {
  requestMultiple,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import {genders} from 'types';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import {ModalWaiting} from 'components';

const options = {
  mediaType: 'photo',
  title: 'Chọn ảnh đại diện..',
  cancelButtonTitle: 'Hủy bỏ',
  takePhotoButtonTitle: 'Chụp ảnh',
  quality: 0.1,
  chooseFromLibraryButtonTitle: 'Chọn từ thư viện',
  includeBase64: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const DeviceInfo = ({route}) => {
  const deviceInfo = route?.params?.device_info;
  const deviceId = route?.params?.device_id;
  const deviceName = deviceInfo?.ManufacturerName;
  const childrenName = route?.params?.children_name;
  const deviceSN = deviceInfo?.SerialNumber;
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

  //cập nhật device info
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

  //cập nhật device avatar
  const mutationDeviceAvatarUpdate = useMutation(
    ({data_device_id, data_avatar}) =>
      deviceAvatarUpdateApi(data_device_id, data_avatar),
  );

  const handleOpenCamera = () => {
    setVisibleImagePicker(false);
    setTimeout(() => {
      options.mediaType = 'photo';
      launchCamera(options, response => {
        if (response && response?.assets) {
          let item = response?.assets?.[0];
          let dataFirstBase64 = 'data:' + item?.type + ';base64,';
          let formatData = dataFirstBase64 + item?.base64;
          ImageResizer.createResizedImage(
            formatData,
            300,
            300,
            'JPEG',
            100,
            Platform.OS === 'android' ? 90 : 0,
            undefined,
            false,
            {},
          )
            .then(resp => {
              return RNFS.readFile(resp?.path, 'base64');
            })
            .then(result => {
              setDataRequestAvatar(dataFirstBase64 + result);
            });
          setAvatarUri({uri: item?.uri});
        }
      });
    }, 100);
  };

  const handleOpenLibrary = () => {
    setVisibleImagePicker(false);
    setTimeout(() => {
      options.mediaType = 'photo';
      launchImageLibrary(options, response => {
        if (response && response?.assets) {
          let item = response?.assets?.[0];
          let dataFirstBase64 = 'data:' + item?.type + ';base64,';
          let formatData = dataFirstBase64 + item?.base64;
          ImageResizer.createResizedImage(
            formatData,
            300,
            300,
            'JPEG',
            100,
            Platform.OS === 'android' ? 90 : 0,
            undefined,
            false,
            {},
          )
            .then(resp => {
              return RNFS.readFile(resp?.path, 'base64');
            })
            .then(result => {
              setDataRequestAvatar(dataFirstBase64 + result);
            });
          setAvatarUri({uri: item?.uri});
        }
      });
    }, 100);
  };

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
        'required.fullName': 'Tên không được bỏ trống',
        'required.gender': 'Giới tính không được bỏ trống',
        'required.birthday': 'Ngày sinh không được bỏ trống',
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
    //cập nhật avatar
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
          Toast('Cập nhật thông tin thành công');
        } else {
          Toast('Cập nhật thông tin thất bại');
        }
        mutationDeviceAvatarUpdate.reset();
        mutationDeviceUpdate.reset();
      })
      .catch(err => {
        mutationDeviceAvatarUpdate.reset();
        mutationDeviceUpdate.reset();
        Toast(err?.msg);
      });
  };

  // const handleSaveInfo = () => {
  //   const validation = new Validator(
  //     {
  //       name: name,
  //       birthday: birthday,
  //       gender: gender,
  //     },
  //     {
  //       name: 'required',
  //       birthday: 'required',
  //       gender: 'required',
  //     },
  //     {
  //       'required.name': 'Họ tên trẻ không được bỏ trống',
  //       'required.birthday': 'Ngày sinh trẻ không được bỏ trống',
  //       'required.gender': 'Giới tính trẻ không được bỏ trống',
  //     },
  //   );

  //   if (validation.fails()) {
  //     setErrors({
  //       ...errors,
  //       name: validation.errors.first('name'),
  //       birthday: validation.errors.first('birthday'),
  //       gender: validation.errors.first('gender'),
  //     });
  //     return;
  //   }

  //   if (validation.passes()) {
  //     setErrors({
  //       ...errors,
  //       name: validation.errors.first('name'),
  //       birthday: validation.errors.first('birthday'),
  //       gender: validation.errors.first('gender'),
  //     });
  //   }

  //   //thực hiện kích hoạt
  //   mutationActivatedDevice
  //     .mutateAsync({
  //       data_imei: deviceSN,
  //       data_device_info: deviceInfo,
  //       data_name: name,
  //       data_birthday: birthday,
  //       data_gender: gender,
  //       data_avatar: dataRequestAvatar,
  //     })
  //     .then(resp => {
  //       if (resp.status) {
  //         setVisibleWaitingModal(true);
  //         // Toast(resp?.msg);
  //         // RootNavigation.navigate(navigationTypes.childrenManager.screen);
  //       } else {
  //         if (!resp?.imei_invalid) {
  //           RootNavigation.navigate(navigationTypes.imei.screen, {
  //             imei: deviceSN,
  //             name: name,
  //             deviceName: deviceName,
  //             birthday: birthday,
  //             gender: gender,
  //             dataRequestAvatar: dataRequestAvatar,
  //             deviceInfo: deviceInfo,
  //           });
  //         }
  //       }
  //       mutationActivatedDevice.reset();
  //     })
  //     .catch(err => {
  //       Toast(err?.msg);
  //       mutationActivatedDevice.reset();
  //     });
  // };

  const handleSetting = () => {
    setVisiblePermissionCamera(false);
    openSettings().catch(() => console.warn('cannot open settings'));
  };
  return (
    <Background isKeyboard bout>
      <ModalWaiting
        onPressCancel={() => {
          setVisibleWaitingModal(false);
          RootNavigation.navigate(navigationTypes.childrenManager.screen);
        }}
        visible={visibleWaitingModal}
      />
      <Loading isLoading={mutationActivatedDevice?.isLoading} />
      <PopupConfirm
        labelBtnLeft="Cài đặt"
        labelBtnRight="Huỷ"
        visible={visiblePermissionCamera}
        content={
          'SafeZone muốn truy cập máy ảnh của bạn để chụp ảnh, vui lòng cho phép truy cập máy ảnh của bạn \n Settings > SafeZone > Camera'
        }
        onPressCancel={() => {
          setVisiblePermissionCamera(false);
        }}
        onPressAgree={handleSetting}
      />
      <ButtonBack />
      <ModalBottomSheet
        onPressOne={handleOpenCamera}
        onPressTwo={handleOpenLibrary}
        onPressCancel={() => setVisibleImagePicker(false)}
        visible={visibleImagePicker}
        onPressClose={() => setVisibleImagePicker(false)}
      />
      <View style={styles.container}>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Quản lý thông tin trẻ
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
            placeholder="Họ và tên trẻ"
          />
          {errors?.name && <TextError message={errors?.name} />}
        </View>
        <View style={styles.wrapInput}>
          <Input
            value={deviceName}
            customerInput={{backgroundColor: colors.COLOR_DISABLE}}
            containerInput={{backgroundColor: colors.COLOR_DISABLE}}
            props={{editable: false}}
            placeholder="Tên thiết bị"
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
              placeholder="--Giới tính--"
              listData={genders}
            />
            {errors?.gender && <TextError message={errors?.gender} />}
          </View>
        </View>
        <Button
          customStyle={styles.btn}
          label="Lưu lại"
          onPress={handleUpdateInfo}
        />
      </View>
    </Background>
  );
};

export default DeviceInfo;
