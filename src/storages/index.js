import AsyncStorage from '@react-native-async-storage/async-storage';
import keys from './keys';
import moment from 'moment';
import * as Keychain from 'react-native-keychain';

//set
export const setKeyChain = async (account, password, options) => {
  try {
    await Keychain.setGenericPassword(account, password, options);
  } catch (e) {
    await Keychain.setGenericPassword(account, null);
  }
};

export const setToken = async token => {
  try {
    await AsyncStorage.setItem(keys.token, token);
  } catch (e) {
    await AsyncStorage.setItem(keys.token, null);
  }
};

export const setExpiredToken = async () => {
  try {
    await AsyncStorage.setItem(
      keys.expired_token,
      moment().format('DD-MM-YYYY HH:mm:ss'),
    );
  } catch (e) {
    await AsyncStorage.setItem(keys.expired_token, null);
  }
};

export const setError = async content => {
  try {
    await AsyncStorage.setItem(keys.error_bug, JSON.stringify(content));
  } catch (e) {
    await AsyncStorage.setItem(keys.error_bug, null);
  }
};

//get
export const getKeyChain = async () => {
  try {
    const value = await Keychain.getGenericPassword();
    return value;
  } catch (e) {
    return null;
  }
};

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem(keys.token);
    return value;
  } catch (e) {
    return null;
  }
};

export const getExpiredToken = async () => {
  try {
    const value = await AsyncStorage.getItem(keys.expired_token);
    return value;
  } catch (e) {
    return null;
  }
};

export const getError = async () => {
  try {
    const value = await AsyncStorage.getItem(keys.error_bug);
    return value;
  } catch (e) {
    return null;
  }
};

//remove
export const removeAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    return false;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(keys.token);
    return true;
  } catch (e) {
    return false;
  }
};

export const removeKeyChain = async () => {
  try {
    await Keychain.resetGenericPassword();
    return true;
  } catch (e) {
    return false;
  }
};
