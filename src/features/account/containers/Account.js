import React, {useState, useEffect} from 'react';
import {Text, Background, Button, Input, ButtonBack} from 'base';
import {
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {logoutRequest} from 'actions/loginActions';
import {
  updateUserAvatarRequest,
  updateUserAvatarReset,
  updateUserInfoRequest,
  updateUserInfoReset,
} from 'actions/userActions';
import {colors, commonStyles} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {PopupConfirm, Loading, TextError, ModalBottomSheet} from 'components';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import Validator from 'validatorjs';
import {Toast} from 'customs';
import {buildAvatar} from 'src/helpers/funcs';
import VersionInfo from 'react-native-version-info';

const options = {
  mediaType: 'photo',
  quality: 0.1,
  includeBase64: true,
};

const Account = () => {
  const dispatch = useDispatch();
  const isLoadingLogout = useSelector(state => state.auth.isLoadingLogout);
  const userInfo = useSelector(state => state.user.userInfo);
  const isLoadingUpdateUserAvatar = useSelector(
    state => state.user.isLoadingUpdateUserAvatar,
  );
  const isLoadingUpdateUserInfo = useSelector(
    state => state.user.isLoadingUpdateUserInfo,
  );
  const statusUpdateUserAvatar = useSelector(
    state => state.user.statusUpdateUserAvatar,
  );
  const statusUpdateUserInfo = useSelector(
    state => state.user.statusUpdateUserInfo,
  );
  const dataErrors = useSelector(state => state.user.errors);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [visibleImagePicker, setVisibleImagePicker] = useState(false);
  const [name, setName] = useState(userInfo?.name);
  const [errors, setErrors] = useState({});
  const [avatarUri, setAvatarUri] = useState(
    userInfo?.image
      ? {uri: buildAvatar(userInfo?.image)}
      : images.avatars.default,
  );
  const [dataRequestAvatar, setDataRequestAvatar] = useState('');
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  useEffect(() => {
    if (dataErrors && dataErrors?.msg) {
      Toast(dataErrors?.msg);
      dispatch(updateUserAvatarReset());
      dispatch(updateUserInfoReset());
    }
  }, [dataErrors, dispatch]);

  useEffect(() => {
    if (statusUpdateUserAvatar || statusUpdateUserInfo) {
      Toast('Cập nhật thông tin thành công');
      dispatch(updateUserAvatarReset());
      dispatch(updateUserInfoReset());
    }
  }, [statusUpdateUserAvatar, statusUpdateUserInfo, dispatch]);

  const handleLogout = () => {
    setVisibleConfirm(false);
    dispatch(logoutRequest());
  };

  const handleRedirectChangePassword = () => {
    RootNavigation.navigate(navigationTypes.newPassword.screen);
  };

  const handleUpdate = () => {
    const validation = new Validator(
      {
        name: name,
      },
      {
        name: 'required',
      },
      {
        'required.name': 'Họ và tên không được bỏ trống',
      },
    );

    if (validation.fails()) {
      setErrors({...errors, name: validation.errors.first('name')});
      return;
    }

    if (validation.passes()) {
      setErrors({...errors, name: validation.errors.first('name')});
    }

    //update avatar
    if (dataRequestAvatar) {
      dispatch(updateUserAvatarRequest(dataRequestAvatar));
    }

    if (userInfo.name !== name) {
      //code update user
      dispatch(updateUserInfoRequest(name));
    }
  };

  const handleOpenCamera = () => {
    options.mediaType = 'photo';
    launchCamera(options, response => {
      if (response && response?.assets) {
        let item = response.assets?.[0];
        let formatData = 'data:' + item.type + ';base64,' + item.base64;
        setDataRequestAvatar(formatData);
        setAvatarUri({uri: item.uri});
      }
    });
  };

  const handleOpenLibrary = () => {
    setVisibleImagePicker(false);
    options.mediaType = 'photo';
    launchImageLibrary(options, response => {
      if (response && response?.assets) {
        let item = response.assets?.[0];
        let formatData = 'data:' + item.type + ';base64,' + item.base64;
        setDataRequestAvatar(formatData);
        setAvatarUri({uri: item.uri});
      }
    });
  };

  const handleOpenBottomSheetImagePicker = () => {
    setVisibleImagePicker(true);
  };

  return (
    <Background bout>
      <ModalBottomSheet
        onPressOne={() => {
          setVisibleImagePicker(false);
          setTimeout(() => {
            handleOpenCamera();
          }, 200);
        }}
        onPressTwo={() => {
          setVisibleImagePicker(false);
          setTimeout(() => {
            handleOpenLibrary();
          }, 200);
        }}
        onPressCancel={() => setVisibleImagePicker(false)}
        visible={visibleImagePicker}
        onPressClose={() => setVisibleImagePicker(false)}
      />
      <Loading
        isLoading={
          isLoadingLogout ||
          isLoadingUpdateUserAvatar ||
          isLoadingUpdateUserInfo
        }
      />
      <PopupConfirm
        content="Bạn có chắc chắn muốn thoát không?"
        visible={visibleConfirm}
        onPressCancel={() => setVisibleConfirm(!visibleConfirm)}
        onPressAgree={handleLogout}
      />
      <View>
        <ButtonBack />
      </View>
      <ScrollView style={styles.container}>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Quản lý thông tin
        </Text>
        <TouchableOpacity
          onPress={handleOpenBottomSheetImagePicker}
          activeOpacity={0.9}
          style={styles.wrapAvatar}>
          {loadingAvatar && (
            <View style={styles.wrapActivityIndicator}>
              <ActivityIndicator color={colors.COLOR_WHITE} />
            </View>
          )}
          <>
            <FastImage
              onLoadEnd={() => setLoadingAvatar(false)}
              onLoadStart={() => setLoadingAvatar(true)}
              onError={() => setLoadingAvatar(false)}
              style={styles.avatar}
              source={avatarUri}
            />
            <FastImage
              style={styles.iconCapturePlus}
              source={images.icons.capture_white_plus}
            />
          </>
        </TouchableOpacity>
        <View style={styles.wrapInput}>
          <Input
            value={name}
            onChangeValue={val => setName(val)}
            placeholder="Họ và tên"
          />
          {errors?.name && <TextError message={errors?.name} />}
        </View>
        <View style={styles.wrapInput}>
          <Input
            containerInput={{backgroundColor: colors.COLOR_DISABLE}}
            customerInput={{backgroundColor: colors.COLOR_DISABLE}}
            props={{editable: false}}
            placeholder="Số điện thoại"
            value={userInfo.phone}
          />
        </View>
        <Text
          style={styles.btnChangePassword}
          onPress={handleRedirectChangePassword}>
          Đổi mật khẩu
        </Text>
        <View style={styles.wrapBtn}>
          <Button
            onPress={() => setVisibleConfirm(true)}
            customStyle={styles.btn}
            label="Đăng xuất"
          />
          <Button
            customStyle={styles.btn}
            onPress={handleUpdate}
            label="Cập nhật"
          />
        </View>
      </ScrollView>
      <Text style={styles.version}>Ver {VersionInfo.appVersion}</Text>
    </Background>
  );
};

export default Account;
