import {takeLatest} from 'redux-saga/effects';
import * as types from '../../constants';
import {
  loginRequest,
  logoutRequest,
  registerRequest,
  fogotPasswordRequest,
  verifyOtpRequest,
  resetPasswordRequest,
} from './loginSagas';

export function* watchLoginRequest() {
  //đăng nhập
  yield takeLatest(types.LOGIN.REQUEST, loginRequest);
}

export function* watchOutRequest() {
  //đăng xuất
  yield takeLatest(types.LOGOUT.REQUEST, logoutRequest);
}

export function* watchRegisterRequest() {
  //đăng ký tài khoản
  yield takeLatest(types.REGISTER.REQUEST, registerRequest);
}

export function* watchFogotPasswordRequest() {
  //lấy lại mật khẩu
  yield takeLatest(types.FOGOT_PASSWORD.REQUEST, fogotPasswordRequest);
}

export function* watchVerifyOtpRequest() {
  //xác thực otp
  yield takeLatest(types.VERIFY_OTP.REQUEST, verifyOtpRequest);
}

export function* watchResetPasswordRequest() {
  //làm mới mật khẩu
  yield takeLatest(types.RESET_PASSWORD.REQUEST, resetPasswordRequest);
}
