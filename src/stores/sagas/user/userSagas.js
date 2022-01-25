import {put, call} from 'redux-saga/effects';
import {
  userInfoApi,
  updateUserAvatarApi,
  updateUserInfoApi,
  changePasswordApi,
} from 'src/api/methods/user';
import {getToken, setToken} from 'storages';
import {
  userInfoSuccess,
  userInfoFailure,
  updateUserAvatarSuccess,
  updateUserAvatarFailure,
  updateUserInfoSuccess,
  updateUserInfoFailure,
  changePasswordSuccess,
  changePasswordFailure,
} from 'actions/userActions';
import {loginFailure, loginSuccess} from 'actions/loginActions';
import SplashScreen from 'react-native-splash-screen';

//get user info
export function* userInfoRequest() {
  try {
    let token = yield call(getToken);
    if (token) {
      yield put(loginSuccess());
      let respUserInfo = yield call(userInfoApi, token);
      yield put(userInfoSuccess(respUserInfo?.data));
      yield SplashScreen.hide();
    } else {
      yield put(loginFailure('Xảy ra lỗi hệ thống'));
    }
  } catch (error) {
    yield put(userInfoFailure('Xảy ra lỗi hệ thống'));
  }
}

//update avatar
export function* updateAvatarRequest(action) {
  try {
    const {image} = action.payload;
    let respUpdateAvatar = yield call(updateUserAvatarApi, image);
    if (respUpdateAvatar?.status) {
      yield put(updateUserAvatarSuccess(respUpdateAvatar?.data?.image));
    } else {
      yield put(updateUserAvatarFailure(respUpdateAvatar?.msg));
    }
  } catch (error) {
    yield put(
      updateUserAvatarFailure('Xảy ra lỗi hệ thống khi cập nhật ảnh đại diện'),
    );
  }
}

//update user info
export function* updateUserInfoRequest(action) {
  try {
    const {name} = action.payload;
    let respUpdateUserInfo = yield call(updateUserInfoApi, name);
    if (respUpdateUserInfo?.status) {
      yield put(updateUserInfoSuccess(name));
    } else {
      yield put(updateUserInfoFailure(respUpdateUserInfo?.msg));
    }
  } catch (error) {
    yield put(
      updateUserInfoFailure('Xảy ra lỗi hệ thống khi cập nhật thông tin'),
    );
  }
}

//change password
export function* changePasswordRequest(action) {
  try {
    const {oldPassword, newPassword, rePassword} = action.payload;
    let respChangePassword = yield call(
      changePasswordApi,
      oldPassword,
      newPassword,
      rePassword,
    );
    if (respChangePassword?.status) {
      yield setToken(respChangePassword?.token);
      yield put(changePasswordSuccess());
    } else {
      yield put(changePasswordFailure(respChangePassword?.msg));
    }
  } catch (error) {
    yield put(
      changePasswordFailure('Xảy ra lỗi hệ thống khi cập nhật mật khẩu'),
    );
  }
}
