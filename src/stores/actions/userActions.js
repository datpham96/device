import * as types from '../constants';

//userInfo
export function userInfoRequest() {
  return {
    type: types.USER_INFO.REQUEST,
  };
}

export function userInfoSuccess(userInfo) {
  return {
    type: types.USER_INFO.SUCCESS,
    payload: {
      userInfo,
    },
  };
}

export function userInfoFailure(msg) {
  return {
    type: types.USER_INFO.FAILURE,
    payload: {
      msg,
    },
  };
}

export function userInfoReset() {
  return {
    type: types.USER_INFO.RESET,
  };
}

//update avatar
export function updateUserAvatarRequest(image) {
  return {
    type: types.USER_AVATAR.REQUEST,
    payload: {
      image,
    },
  };
}

export function updateUserAvatarSuccess(image) {
  return {
    type: types.USER_AVATAR.SUCCESS,
    payload: {
      image,
    },
  };
}

export function updateUserAvatarFailure(msg) {
  return {
    type: types.USER_AVATAR.FAILURE,
    payload: {
      msg,
    },
  };
}

export function updateUserAvatarReset() {
  return {
    type: types.USER_AVATAR.RESET,
  };
}

//update user info
export function updateUserInfoRequest(name) {
  return {
    type: types.UPDATE_USER_INFO.REQUEST,
    payload: {
      name,
    },
  };
}

export function updateUserInfoSuccess(name) {
  return {
    type: types.UPDATE_USER_INFO.SUCCESS,
    payload: {
      name,
    },
  };
}

export function updateUserInfoFailure(msg) {
  return {
    type: types.UPDATE_USER_INFO.FAILURE,
    payload: {
      msg,
    },
  };
}

export function updateUserInfoReset() {
  return {
    type: types.UPDATE_USER_INFO.RESET,
  };
}

//change password
export function changePasswordRequest(oldPassword, newPassword, rePassword) {
  return {
    type: types.CHANGE_PASSWORD.REQUEST,
    payload: {
      oldPassword,
      newPassword,
      rePassword,
    },
  };
}

export function changePasswordSuccess() {
  return {
    type: types.CHANGE_PASSWORD.SUCCESS,
  };
}

export function changePasswordFailure(msg) {
  return {
    type: types.CHANGE_PASSWORD.FAILURE,
    payload: {
      msg,
    },
  };
}

export function changePasswordReset() {
  return {
    type: types.CHANGE_PASSWORD.RESET,
  };
}
