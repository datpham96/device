import AsyncStorage from '@react-native-async-storage/async-storage';
import keys from './keys';
import moment from 'moment';

//set
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

//get
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
