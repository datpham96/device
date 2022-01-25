import ApiConstants from './ApiConstants';
import axios from 'axios';
import moment from 'moment';
import {getToken, getExpiredToken, removeAll} from 'storages';
import * as RootNavigation from '../navigation/RootNavigation';
import navigationType from 'navigationTypes';
import NetInfo from '@react-native-community/netinfo';

axios.interceptors.request.use(function (config) {
  NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      RootNavigation.navigate(navigationType.disconnect.screen);
    }
  });
  return config;
}, null);

export function api(path, method, params = {}) {
  let options;
  options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 30000,
    method: method,
    data: params,
  };
  return axios(ApiConstants.BASE_URL + path, options)
    .then(json => {
      return json.data;
    })
    .catch(async error => {
      if (error.response.status === 500) {
        RootNavigation.navigate(navigationType.error.screen);
        return {
          data: null,
        };
      }
      return Promise.reject(error);
    });
}

export async function apiToken(path, method, params = {}, token) {
  let tokenStore = null;
  let expired_token = await getExpiredToken();
  if (
    moment().diff(moment(expired_token, 'DD-MM-YYYY HH:mm:ss'), 'days', true) <=
    2
  ) {
    tokenStore = await getToken();
  } else {
    await removeAll();
  }
  let myToken = tokenStore || token;
  // let myToken = '';
  let options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + myToken,
    },
    timeout: 30000,
    method: method,
    data: params,
  };
  return axios(ApiConstants.BASE_URL + path, options)
    .then(json => {
      return json.data;
    })
    .catch(async error => {
      if (error.response.status === 500) {
        RootNavigation.navigate(navigationType.error.screen);
        return {
          data: null,
        };
      }
      if (error.response.status === 401) {
        await removeAll();
        RootNavigation.navigate(navigationType.login.screen);
      }
      return Promise.reject(error);
    });
}
