import {apiToken} from 'api';
import ApiConstants from '../ApiConstants';

export function userInfoApi(token) {
  //Thông tin tài khoản
  return apiToken(ApiConstants.USER_INFO, 'post', null, token);
}

export function updateUserInfoApi(name) {
  //cập nhật thông tin tài khoản
  let bodyFormData = new FormData();
  bodyFormData.append('name', name);
  return apiToken(ApiConstants.UPDATE_USER_INFO, 'post', bodyFormData);
}

export function updateUserAvatarApi(image) {
  //cập nhật avatar tài khoản
  let bodyFormData = new FormData();
  bodyFormData.append('image', image);
  return apiToken(ApiConstants.UPDATE_USER_AVATAR, 'post', bodyFormData);
}

export function changePasswordApi(old_password, new_password, repassword) {
  //cập nhật mật khẩu
  let bodyFormData = new FormData();
  bodyFormData.append('old_password', old_password);
  bodyFormData.append('new_password', new_password);
  bodyFormData.append('repassword', repassword);
  return apiToken(ApiConstants.CHANGE_USER_PASSWORD, 'post', bodyFormData);
}
