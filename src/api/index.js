import ApiConstants from './ApiConstants';
import axios from 'axios';
import moment from 'moment';
import {getToken, getExpiredToken, removeAll, setError} from 'storages';
import * as RootNavigation from '../navigation/RootNavigation';
import navigationType from 'navigationTypes';
import NetInfo from '@react-native-community/netinfo';
import statusCode from 'src/config/errors/statusCodes';
import * as Keychain from 'react-native-keychain';

axios.interceptors.request.use(function (config) {
  NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      RootNavigation.navigate(navigationType.disconnect.screen);
    }
  });
  return config;
}, null);

const TIME_OUT = 60000;

export function api(path, method, params = {}) {
  let options;
  options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: TIME_OUT,
    method: method,
    data: params,
  };
  return axios(ApiConstants.BASE_URL + path, options)
    .then(json => {
      return json.data;
    })
    .catch(async error => {
      await setError(JSON.stringify(error?.response?.data));
      if (
        error.response.status === statusCode.CODE_500 ||
        error?.response?.status === statusCode.CODE_429
      ) {
        RootNavigation.navigate(navigationType.error.screen);
        return {
          data: null,
        };
      }
      return Promise.reject(error);
    });
}

export async function apiToken(path, method, params = {}, token) {
  // let tokenStore = null;
  // let expired_token = await getExpiredToken();
  // if (
  //   moment().diff(moment(expired_token, 'DD-MM-YYYY HH:mm:ss'), 'days', true) <=
  //   30
  // ) {
  //   tokenStore = await Keychain.getGenericPassword();
  // } else {
  //   await removeAll();
  // }
  let tokenStore = await Keychain.getGenericPassword();
  let myToken = tokenStore?.password || token;
  let options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + myToken,
    },
    timeout: TIME_OUT,
    method: method,
    data: params,
  };
  return axios(ApiConstants.BASE_URL + path, options)
    .then(json => {
      return json.data;
    })
    .catch(async error => {
      await setError(JSON.stringify(error?.response?.data));
      if (
        error?.response?.status === statusCode.CODE_500 ||
        error?.response?.status === statusCode.CODE_429
      ) {
        RootNavigation.navigate(navigationType.error.screen);
        return {
          data: null,
        };
      }
      if (error?.response?.status === statusCode.CODE_401) {
        RootNavigation.navigate(navigationType.error401.screen);
        return {
          data: null,
        };
      }
      return Promise.reject(error);
    });
}
