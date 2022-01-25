import {all, fork} from 'redux-saga/effects';
import {
  watchLoginRequest,
  watchOutRequest,
  watchRegisterRequest,
  watchFogotPasswordRequest,
  watchVerifyOtpRequest,
  watchResetPasswordRequest,
} from './login';
import {
  watchUserInfoRequest,
  watchUpdateAvatarRequest,
  watchUpdateUserInfoRequest,
  watchChangePasswordRequest,
} from './user';

export default function* rootSaga() {
  yield all([
    //login
    fork(watchLoginRequest),
    fork(watchRegisterRequest),
    fork(watchFogotPasswordRequest),
    fork(watchOutRequest),
    fork(watchVerifyOtpRequest),
    fork(watchResetPasswordRequest),
    //user
    fork(watchUserInfoRequest),
    fork(watchUpdateAvatarRequest),
    fork(watchUpdateUserInfoRequest),
    fork(watchChangePasswordRequest),
  ]);
}
