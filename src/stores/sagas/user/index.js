import {takeLatest} from 'redux-saga/effects';
import * as types from '../../constants';
import {
  userInfoRequest,
  updateAvatarRequest,
  updateUserInfoRequest,
  changePasswordRequest,
} from './userSagas';

export function* watchUserInfoRequest() {
  //lấy thông tin tài hoản
  yield takeLatest(types.USER_INFO.REQUEST, userInfoRequest);
}

export function* watchUpdateAvatarRequest() {
  //cập nhật avatar
  yield takeLatest(types.USER_AVATAR.REQUEST, updateAvatarRequest);
}

export function* watchUpdateUserInfoRequest() {
  //cập nhật thông tin
  yield takeLatest(types.UPDATE_USER_INFO.REQUEST, updateUserInfoRequest);
}

export function* watchChangePasswordRequest() {
  //thay đổi mật khẩu
  yield takeLatest(types.CHANGE_PASSWORD.REQUEST, changePasswordRequest);
}
