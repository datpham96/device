import {put, call} from 'redux-saga/effects';
import * as types from '../../constants';
import {
  fogotPasswordApi,
  loginApi,
  registerApi,
  resetPasswordApi,
  verifyOtpApi,
} from 'src/api/methods/login';
import {userInfoApi} from 'src/api/methods/user';
import {removeAll, setKeyChain, removeKeyChain} from 'storages';
import {
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  fogotPasswordSuccess,
  fogotPasswordFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
  verifyOtpSuccess,
  verifyOtpFailure,
} from 'actions/loginActions';
import {userInfoSuccess} from 'actions/userActions';

//login
export function* loginRequest(action) {
  try {
    let {phone, password} = action.payload;
    let response = yield call(loginApi, phone, password);
    if (response?.data) {
      let respUserInfo = yield call(userInfoApi, response.data?.token);
      yield setKeyChain(phone, response.data?.token);
      yield put(userInfoSuccess(respUserInfo?.data));
      // yield setToken(response.data?.token);
      // yield setExpiredToken();
      yield put(loginSuccess());
    }
  } catch (error) {
    yield put(
      loginFailure(
        error?.response && error?.response?.data
          ? 'Sai tài khoản hoặc mật khẩu'
          : null,
      ),
    );
  }
}

//register
export function* registerRequest(action) {
  try {
    const {name, phone, password} = action.payload;
    let respRegister = yield call(registerApi, name, phone, password);
    if (respRegister?.data?.token) {
      let respUserInfo = yield call(userInfoApi, respRegister.data?.token);
      yield put(userInfoSuccess(respUserInfo?.data));
      yield setKeyChain(phone, respRegister?.data?.token);
      // yield setToken(respRegister?.data?.token);
      // yield setExpiredToken();
      yield put(registerSuccess());
      yield put(loginSuccess());
    } else {
      yield put(registerFailure(respRegister?.msg));
    }
  } catch (error) {
    yield put(
      registerFailure(
        error?.response?.data?.msg
          ? error?.response?.data?.msg
          : 'Xảy ra lỗi hệ thống khi đăng ký tài khoản',
      ),
    );
  }
}

//fogot password
export function* fogotPasswordRequest(action) {
  try {
    const {phone} = action.payload;
    let respFogotPassword = yield call(fogotPasswordApi, phone);
    if (respFogotPassword?.status) {
      yield put(fogotPasswordSuccess(phone, respFogotPassword?.expire_time));
    } else {
      yield put(fogotPasswordFailure(respFogotPassword?.msg));
    }
  } catch (error) {
    yield put(
      fogotPasswordFailure(
        error?.response?.data?.msg
          ? error?.response?.data?.msg
          : 'Xảy ra lỗi hệ thống khi lấy lại mật khẩu',
      ),
    );
  }
}

//verify password
export function* verifyOtpRequest(action) {
  try {
    const {otp} = action.payload;
    let respVerifyOtp = yield call(verifyOtpApi, otp);
    if (respVerifyOtp?.status) {
      yield put(verifyOtpSuccess(otp));
    } else {
      yield put(verifyOtpFailure(respVerifyOtp?.msg));
    }
  } catch (error) {
    yield put(
      verifyOtpFailure(
        error?.response?.data?.msg
          ? error?.response?.data?.msg
          : 'Xảy ra lỗi hệ thống khi xác nhận OTP',
      ),
    );
  }
}

//reset password
export function* resetPasswordRequest(action) {
  try {
    const {code, phone, password, rePassword} = action.payload;
    let respResetPassword = yield call(
      resetPasswordApi,
      code,
      phone,
      password,
      rePassword,
    );
    if (respResetPassword?.status) {
      yield setKeyChain(phone, respResetPassword?.token);
      // yield setToken(respResetPassword?.token);
      yield put(resetPasswordSuccess());
    } else {
      yield put(resetPasswordFailure(respResetPassword?.msg));
    }
  } catch (error) {
    yield put(
      resetPasswordFailure(
        error?.response?.data?.msg
          ? error?.response?.data?.msg
          : 'Xảy ra lỗi hệ thống khi lấy lại mật khẩu',
      ),
    );
  }
}

//logout
export function* logoutRequest() {
  try {
    yield removeAll();
    yield removeKeyChain();
    yield put({type: types.LOGOUT.SUCCESS});
  } catch (error) {
    yield put({
      type: types.LOGOUT.FAILURE,
      payload: {
        msg: 'Xảy ra lỗi khi đăng xuất',
      },
    });
  }
}
