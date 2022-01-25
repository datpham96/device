import {createRequestTypes} from './helpers';

// Login events
export const LOGIN = createRequestTypes('LOGIN');
export const LOGOUT = createRequestTypes('LOGOUT');
export const USER_INFO = createRequestTypes('USER_INFO');
export const USER_AVATAR = createRequestTypes('USER_AVATAR');
export const UPDATE_USER_INFO = createRequestTypes('UPDATE_USER_INFO');
export const CHANGE_PASSWORD = createRequestTypes('CHANGE_PASSWORD');
export const REGISTER = createRequestTypes('REGISTER');
export const FOGOT_PASSWORD = createRequestTypes('FOGOT_PASSWORD');
export const VERIFY_OTP = createRequestTypes('VERIFY_OTP');
export const RESET_PASSWORD = createRequestTypes('RESET_PASSWORD');
