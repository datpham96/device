import React, {useState, useEffect, useRef} from 'react';
import {Text, Background, Button, Input} from 'base';
import {
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
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
import {useQueryClient} from 'react-query';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import Clipboard from '@react-native-clipboard/clipboard';

import {
  requestMultiple,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import {getError} from 'storages';

const options = {
  mediaType: 'photo',
  quality: 1,
  includeBase64: true,
};

const Account = () => {
  const touchTimoutRef = useRef(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
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
  const [visiblePermissionCamera, setVisiblePermissionCamera] = useState(false);
  const [touchTimes, setTouchTimes] = useState(0);

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
    queryClient.clear();
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
        let dataFirstBase64 = 'data:' + item.type + ';base64,';
        let formatData = dataFirstBase64 + item.base64;
        ImageResizer.createResizedImage(
          formatData,
          300,
          300,
          'JPEG',
          100,
          0,
          undefined,
          false,
          {},
        )
          .then(resp => {
            return RNFS.readFile(resp.path, 'base64');
          })
          .then(result => {
            setDataRequestAvatar(dataFirstBase64 + result);
          });
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
        let dataFirstBase64 = 'data:' + item.type + ';base64,';
        let formatData = dataFirstBase64 + item.base64;
        ImageResizer.createResizedImage(
          formatData,
          300,
          300,
          'JPEG',
          100,
          0,
          undefined,
          false,
          {},
        )
          .then(resp => {
            return RNFS.readFile(resp.path, 'base64');
          })
          .then(result => {
            setDataRequestAvatar(dataFirstBase64 + result);
          });
        setAvatarUri({uri: item.uri});
      }
    });
  };

  const handleOpenBottomSheetImagePicker = () => {
    //check permission camera
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

  const handleSetting = () => {
    setVisiblePermissionCamera(false);
    openSettings().catch(() => console.warn('cannot open settings'));
  };

  const handleTabLogErr = () => {
    setTouchTimes(prev => prev + 1);
    if (touchTimoutRef.current) {
      clearTimeout(touchTimoutRef.current);
    }
    touchTimoutRef.current = setTimeout(async () => {
      if (touchTimes === 4) {
        handleGetFileErrorLog();
      }
      setTouchTimes(0);
    }, 500);
  };

  const handleCoppy = content => {
    Clipboard.setString(content);
  };

  const handleGetFileErrorLog = async () => {
    let getErrorLog = await getError();
    if (getErrorLog) {
      Alert.alert('Thông tin', getErrorLog, [
        {
          text: 'Đóng',
          style: 'cancel',
        },
        {
          text: 'Sao chép',
          style: 'cancel',
          onPress: () => handleCoppy(getErrorLog),
        },
      ]);
    }
  };

  return (
    <Background bottomTab bout>
      <PopupConfirm
        labelBtnLeft="Cài đặt"
        labelBtnRight="Huỷ"
        visible={visiblePermissionCamera}
        content={
          'SafeZone muốn truy cập máy ảnh của bạn để chụp ảnh đại diện, vui lòng cho phép truy cập máy ảnh của bạn \n Settings > SafeZone > Camera'
        }
        onPressCancel={() => {
          setVisiblePermissionCamera(false);
        }}
        onPressAgree={handleSetting}
      />
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
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}>
        <ScrollView style={styles.container}>
          <TouchableOpacity onPress={handleTabLogErr} activeOpacity={0.9}>
            <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
              Quản lý thông tin
            </Text>
          </TouchableOpacity>
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
              value={userInfo?.phone}
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
      </KeyboardAwareScrollView>
      <Text style={styles.version}>Phiên bản {VersionInfo.appVersion}</Text>
    </Background>
  );
};

export default Account;
