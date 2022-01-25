import * as types from '../constants';

//login
export function loginRequest(phone, password) {
  return {
    type: types.LOGIN.REQUEST,
    payload: {
      phone,
      password,
    },
  };
}

export function loginSuccess() {
  return {
    type: types.LOGIN.SUCCESS,
  };
}

export function loginFailure(msg) {
  return {
    type: types.LOGIN.FAILURE,
    payload: {
      msg: msg,
    },
  };
}

export function logoutRequest() {
  return {
    type: types.LOGOUT.REQUEST,
  };
}

export function loginReset() {
  return {
    type: types.LOGIN.RESET,
  };
}

//register
export function registerRequest(name, phone, password) {
  return {
    type: types.REGISTER.REQUEST,
    payload: {
      name,
      phone,
      password,
    },
  };
}

export function registerSuccess() {
  return {
    type: types.REGISTER.SUCCESS,
  };
}

export function registerFailure(msg) {
  return {
    type: types.REGISTER.FAILURE,
    payload: {
      msg,
    },
  };
}

export function registerReset() {
  return {
    type: types.REGISTER.RESET,
  };
}

//fogot password
export function fogotPasswordRequest(phone) {
  return {
    type: types.FOGOT_PASSWORD.REQUEST,
    payload: {
      phone,
    },
  };
}

export function fogotPasswordSuccess(phone, expireTime) {
  return {
    type: types.FOGOT_PASSWORD.SUCCESS,
    payload: {
      phone,
      expireTime,
    },
  };
}

export function fogotPasswordFailure(msg) {
  return {
    type: types.FOGOT_PASSWORD.FAILURE,
    payload: {
      msg,
    },
  };
}

export function fogotPasswordReset() {
  return {
    type: types.FOGOT_PASSWORD.RESET,
  };
}

//verify otp
export function verifyOtpRequest(otp) {
  return {
    type: types.VERIFY_OTP.REQUEST,
    payload: {
      otp,
    },
  };
}

export function verifyOtpSuccess(otp) {
  return {
    type: types.VERIFY_OTP.SUCCESS,
    payload: {
      otp,
    },
  };
}

export function verifyOtpFailure(msg) {
  return {
    type: types.VERIFY_OTP.FAILURE,
    payload: {
      msg,
    },
  };
}

export function verifyOtpReset() {
  return {
    type: types.VERIFY_OTP.RESET,
  };
}

//reset password
export function resetPasswordRequest(code, phone, password, rePassword) {
  return {
    type: types.RESET_PASSWORD.REQUEST,
    payload: {
      code,
      phone,
      password,
      rePassword,
    },
  };
}

export function resetPasswordSuccess() {
  return {
    type: types.RESET_PASSWORD.SUCCESS,
  };
}

export function resetPasswordFailure(msg) {
  return {
    type: types.RESET_PASSWORD.FAILURE,
    payload: {
      msg,
    },
  };
}

export function resetPasswordReset() {
  return {
    type: types.RESET_PASSWORD.RESET,
  };
}
