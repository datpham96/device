import {put, call} from 'redux-saga/effects';
import {
  userInfoApi,
  updateUserAvatarApi,
  updateUserInfoApi,
  changePasswordApi,
} from 'src/api/methods/user';
import {setKeyChain, getKeyChain} from 'storages';
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
    let token = yield call(getKeyChain);
    if (token?.password) {
      yield put(loginSuccess());
      let respUserInfo = yield call(userInfoApi, token?.password);
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
      // let token = yield call(getToken);
      // if (token) {
      //   let respUserInfo = yield call(userInfoApi, token);
      //   yield put(userInfoSuccess(respUserInfo?.data));
      // }
      let respKeyChain = yield call(getKeyChain);
      if (respKeyChain?.password) {
        let respUserInfo = yield call(userInfoApi, respKeyChain?.password);
        yield put(userInfoSuccess(respUserInfo?.data));
      }
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
    let respKeyChain = yield getKeyChain();
    if (respChangePassword?.status) {
      yield setKeyChain(respKeyChain?.username, respChangePassword?.token);
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
