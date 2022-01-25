import * as types from '../constants';

const initialState = {
  logged: false,
  isLoadingLogin: false,
  isLoadingLogout: false,
  isLoadingRegister: false,
  statusRegister: false,
  isLoadingFogotPassword: false,
  statusFogotPassword: false,
  isLoadingVerifyOtp: false,
  statusVerifyOtp: false,
  isLoadingResetPassword: false,
  statusResetPassword: false,
  otpCode: null,
  phone: null,
  expiredTime: 0,
  errors: {
    msg: null,
  },
};

const loginReducers = (state = initialState, action) => {
  switch (action.type) {
    //login
    case types.LOGIN.REQUEST:
      return {
        ...state,
        isLoadingLogin: true,
      };
    case types.LOGIN.SUCCESS:
      return {
        ...state,
        logged: true,
        isLoadingLogin: false,
        otpCode: null,
        phone: null,
        errors: {...state.errors, msg: null},
      };
    case types.LOGIN.FAILURE:
      return {
        ...state,
        logged: false,
        isLoadingLogin: false,
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.LOGIN.RESET:
      return {
        ...state,
        logged: false,
        isLoadingLogin: false,
        otpCode: null,
        phone: null,
        errors: {...state.errors, msg: null},
      };
    //register
    case types.REGISTER.REQUEST:
      return {
        ...state,
        isLoadingRegister: true,
      };
    case types.REGISTER.SUCCESS:
      return {
        ...state,
        isLoadingRegister: false,
        statusRegister: true,
        errors: {...state.errors, msg: null},
      };
    case types.REGISTER.FAILURE:
      return {
        ...state,
        isLoadingRegister: false,
        statusRegister: false,
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.REGISTER.RESET:
      return {
        ...state,
        isLoadingRegister: false,
        statusRegister: false,
        errors: {...state.errors, msg: null},
      };
    //fogot password
    case types.FOGOT_PASSWORD.REQUEST:
      return {
        ...state,
        isLoadingFogotPassword: true,
      };
    case types.FOGOT_PASSWORD.SUCCESS:
      return {
        ...state,
        isLoadingFogotPassword: false,
        statusFogotPassword: true,
        phone: action?.payload?.phone,
        expiredTime: action?.payload?.expireTime,
        errors: {...state.errors, msg: null},
      };
    case types.FOGOT_PASSWORD.FAILURE:
      return {
        ...state,
        isLoadingFogotPassword: false,
        statusFogotPassword: false,
        phone: null,
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.FOGOT_PASSWORD.RESET:
      return {
        ...state,
        isLoadingFogotPassword: false,
        statusFogotPassword: false,
        errors: {...state.errors, msg: null},
      };
    //verify Otp
    case types.VERIFY_OTP.REQUEST:
      return {
        ...state,
        isLoadingVerifyOtp: true,
      };
    case types.VERIFY_OTP.SUCCESS:
      return {
        ...state,
        isLoadingVerifyOtp: false,
        statusVerifyOtp: true,
        otpCode: action?.payload?.otp,
        errors: {...state.errors, msg: null},
      };
    case types.VERIFY_OTP.FAILURE:
      return {
        ...state,
        isLoadingVerifyOtp: false,
        statusVerifyOtp: false,
        otpCode: null,
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.VERIFY_OTP.RESET:
      return {
        ...state,
        isLoadingVerifyOtp: false,
        statusVerifyOtp: false,
        errors: {...state.errors, msg: null},
      };
    //reset password
    case types.RESET_PASSWORD.REQUEST:
      return {
        ...state,
        isLoadingResetPassword: true,
      };
    case types.RESET_PASSWORD.SUCCESS:
      return {
        ...state,
        isLoadingResetPassword: false,
        statusResetPassword: true,
        otpCode: null,
        phone: null,
        expiredTime: 0,
        errors: {...state.errors, msg: null},
      };
    case types.RESET_PASSWORD.FAILURE:
      return {
        ...state,
        isLoadingResetPassword: false,
        statusResetPassword: false,
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.RESET_PASSWORD.RESET:
      return {
        ...state,
        isLoadingResetPassword: false,
        statusResetPassword: false,
        otpCode: null,
        phone: null,
        expiredTime: 0,
        errors: {...state.errors, msg: null},
      };
    //logout
    case types.LOGOUT.REQUEST:
      return {
        ...state,
        isLoadingLogout: true,
      };
    case types.LOGOUT.SUCCESS:
      return {
        ...state,
        isLoadingLogout: false,
        logged: false,
        errors: {...state.errors, msg: null},
      };
    case types.LOGOUT.FAILURE:
      return {
        ...state,
        isLoadingLogout: false,
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.LOGOUT.RESET:
      return {
        ...state,
        isLoadingLogout: false,
        errors: {...state.errors, msg: null},
      };
    default:
      return state;
  }
};

export default loginReducers;
