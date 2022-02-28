import React, {useState} from 'react';
import {Text, Input, Background, Button, ButtonBack} from 'base';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import {colors, commonStyles} from 'styles';
import FastImage from 'react-native-fast-image';
import {
  InputDateComponent,
  InputSelectComponent,
  TextError,
  ModalBottomSheet,
} from 'components';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import Validator from 'validatorjs';
import moment from 'moment';
import images from 'images';
import {useMutation} from 'react-query';
import {deviceActivationApi} from 'src/api/methods/device';
import {Toast} from 'customs';

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
  const deviceName = deviceInfo?.ManufacturerName;
  const deviceSN = deviceInfo?.SerialNumber;
  const [avatarUri, setAvatarUri] = useState('');
  const [dataRequestAvatar, setDataRequestAvatar] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(moment().format('DD/MM/YYYY'));
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});
  const [visibleImagePicker, setVisibleImagePicker] = useState(false);

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

  const handleOpenCamera = () => {
    setVisibleImagePicker(false);
    setTimeout(() => {
      options.mediaType = 'photo';
      launchCamera(options, response => {
        if (response && response?.assets) {
          let item = response.assets?.[0];
          let formatData = 'data:' + item.type + ';base64,' + item.base64;
          setDataRequestAvatar(formatData);
          setAvatarUri({uri: item.uri});
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
          let item = response.assets?.[0];
          let formatData = 'data:' + item.type + ';base64,' + item.base64;
          setDataRequestAvatar(formatData);
          setAvatarUri({uri: item.uri});
        }
      });
    }, 100);
  };

  const handleOpenBottomSheetImagePicker = () => {
    setVisibleImagePicker(true);
  };

  const handleSaveInfo = () => {
    const validation = new Validator(
      {
        name: name,
        birthday: birthday,
        gender: gender,
      },
      {
        name: 'required',
        birthday: 'required',
        gender: 'required',
      },
      {
        'required.name': 'Họ tên trẻ không được bỏ trống',
        'required.birthday': 'Ngày sinh trẻ không được bỏ trống',
        'required.gender': 'Giới tính trẻ không được bỏ trống',
      },
    );

    if (validation.fails()) {
      setErrors({
        ...errors,
        name: validation.errors.first('name'),
        birthday: validation.errors.first('birthday'),
        gender: validation.errors.first('gender'),
      });
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        name: validation.errors.first('name'),
        birthday: validation.errors.first('birthday'),
        gender: validation.errors.first('gender'),
      });
    }

    //thực hiện kích hoạt
    mutationActivatedDevice
      .mutateAsync({
        data_imei: deviceSN,
        data_device_info: deviceInfo,
        data_name: name,
        data_birthday: birthday,
        data_gender: gender,
        data_avatar: dataRequestAvatar,
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

    // RootNavigation.navigate(navigationTypes.imeiManager.screen, {
    //   name: name,
    //   deviceName: deviceName,
    //   birthday: birthday,
    //   gender: gender,
    //   dataRequestAvatar: dataRequestAvatar,
    //   deviceInfo: deviceInfo,
    // });
  };
  return (
    <Background isKeyboard bout>
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
              onDonePress={val => setGender(val)}
              placeholder="--Giới tính--"
              listData={[
                {label: 'Nam', value: 'male'},
                {label: 'Nữ', value: 'female'},
              ]}
            />
            {errors?.gender && <TextError message={errors?.gender} />}
          </View>
        </View>
        <Button
          customStyle={styles.btn}
          label="Kích hoạt"
          onPress={handleSaveInfo}
        />
      </View>
    </Background>
  );
};

export default DeviceInfo;
