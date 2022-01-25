import {api} from 'api';
import ApiConstants from '../ApiConstants';

export function loginApi(phone, password) {
  //Đăng nhập
  let bodyFormData = new FormData();
  bodyFormData.append('phone', phone);
  bodyFormData.append('password', password);
  return api(ApiConstants.LOGIN, 'post', bodyFormData);
}

export function registerApi(name, phone, password) {
  //Đăng ký
  let bodyFormData = new FormData();
  bodyFormData.append('phone', phone);
  bodyFormData.append('name', name);
  bodyFormData.append('password', password);
  return api(ApiConstants.REGISTER, 'post', bodyFormData);
}

export function fogotPasswordApi(phone) {
  //Quên mật khẩu
  let bodyFormData = new FormData();
  bodyFormData.append('phone', phone);
  return api(ApiConstants.FOGOT_PASSWORD, 'post', bodyFormData);
}

export function resetPasswordApi(code, phone, password, repassword) {
  //Đặt lại mật khẩu
  let bodyFormData = new FormData();
  bodyFormData.append('code', code);
  bodyFormData.append('phone', phone);
  bodyFormData.append('password', password);
  bodyFormData.append('repassword', repassword);
  return api(ApiConstants.RESET_PASSWORD, 'post', bodyFormData);
}

export function verifyOtpApi(code) {
  //xác minh Otp
  let bodyFormData = new FormData();
  bodyFormData.append('token', code);
  return api(ApiConstants.VERIFY_OTP, 'post', bodyFormData);
}
