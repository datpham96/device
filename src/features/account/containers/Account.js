import React, {useState, useEffect, useRef, useCallback, Suspense} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
//node_modules
import {useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import VersionInfo from 'react-native-version-info';
import {useQueryClient} from 'react-query';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Clipboard from '@react-native-clipboard/clipboard';
import Validator from 'validatorjs';
import {
  requestMultiple,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
//api
//base
import {Text, Background, Button, Input} from 'base';
//components
import {Loading, TextError} from 'components';
//config
import {colors, commonStyles} from 'styles';
import images from 'images';
//helpers
import {buildAvatar, flashMessage} from 'src/helpers/funcs';
//HOC
//hooks
//navigation
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
//storages
import {getError} from 'storages';
//redux-stores
import {logoutRequest} from 'actions/loginActions';
import {
  updateUserAvatarRequest,
  updateUserAvatarReset,
  updateUserInfoRequest,
  updateUserInfoReset,
  userInfoRequest,
} from 'actions/userActions';
//feature
import styles from './styles';
//code-splitting
const PopupConfirm = React.lazy(() =>
  import('src/components/Popups/PopupConfirmComponent'),
);
const ModalCameraBottomSheet = React.lazy(() =>
  import('src/components/Modals/ModalCameraBottomSheetComponent'),
);
//screen

const Account = () => {
  const touchTimoutRef = useRef(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isLoadingLogout = useSelector(state => state?.auth?.isLoadingLogout);
  const userInfo = useSelector(state => state?.user?.userInfo);
  const isLoadingUpdateUserAvatar = useSelector(
    state => state?.user?.isLoadingUpdateUserAvatar,
  );
  const isLoadingUpdateUserInfo = useSelector(
    state => state?.user?.isLoadingUpdateUserInfo,
  );
  const statusUpdateUserAvatar = useSelector(
    state => state?.user?.statusUpdateUserAvatar,
  );
  const statusUpdateUserInfo = useSelector(
    state => state?.user?.statusUpdateUserInfo,
  );
  const dataErrors = useSelector(state => state?.user?.errors);
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
    if (userInfo) {
      setAvatarUri(userInfo?.image ? {uri: buildAvatar(userInfo?.image)} : '');
    }
  }, [userInfo]);

  useEffect(() => {
    if (dataErrors && dataErrors?.msg) {
      flashMessage.error(dataErrors?.msg);
      dispatch(updateUserAvatarReset());
      dispatch(updateUserInfoReset());
    }
  }, [dataErrors, dispatch]);

  useEffect(() => {
    if (statusUpdateUserAvatar || statusUpdateUserInfo) {
      flashMessage.success('Cập nhật thông tin thành công');
      dispatch(updateUserAvatarReset());
      dispatch(updateUserInfoReset());
    }
  }, [statusUpdateUserAvatar, statusUpdateUserInfo, dispatch]);

  const handleLogout = useCallback(() => {
    queryClient.clear();
    setVisibleConfirm(false);
    dispatch(logoutRequest());
  }, [dispatch, queryClient]);

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

  const handleSetting = useCallback(() => {
    setVisiblePermissionCamera(false);
    openSettings().catch(() => console.warn('cannot open settings'));
  }, []);

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

  const onRefresh = useCallback(() => {
    dispatch(userInfoRequest());
  }, [dispatch]);

  return (
    <Background bottomTab bout>
      <Suspense fallback={<></>}>
        {visiblePermissionCamera && (
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
        )}
        {visibleConfirm && (
          <PopupConfirm
            content="Bạn có chắc chắn muốn thoát không?"
            visible={visibleConfirm}
            onPressCancel={() => setVisibleConfirm(!visibleConfirm)}
            onPressAgree={handleLogout}
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
      <Loading
        isLoading={
          isLoadingLogout ||
          isLoadingUpdateUserAvatar ||
          isLoadingUpdateUserInfo
        }
      />
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={colors.COLOR_WHITE}
          />
        }
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}>
        <View style={styles.container}>
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
        </View>
      </KeyboardAwareScrollView>
      <Text style={styles.version}>Phiên bản {VersionInfo.appVersion}</Text>
    </Background>
  );
};

export default Account;
