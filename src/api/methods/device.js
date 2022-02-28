import {apiToken} from 'api';
import ApiConstants from '../ApiConstants';

export function deviceActivationApi(
  imei,
  device_info,
  name,
  birthday,
  gender,
  avatar,
) {
  //Kích hoạt thiết bị
  let bodyFormData = new FormData();
  bodyFormData.append('imei', imei);
  bodyFormData.append('device_info', JSON.stringify(device_info));
  bodyFormData.append('name', name);
  bodyFormData.append('birthday', birthday);
  bodyFormData.append('gender', gender);
  bodyFormData.append('avatar', avatar);
  return apiToken(ApiConstants.DEVICE_ACTIVATION, 'post', bodyFormData);
}

export function deviceListApi() {
  //Danh sách thiết bị
  // let bodyFormData = new FormData();
  // bodyFormData.append('imei', imei);
  // bodyFormData.append('device_info', JSON.stringify(device_info));
  // bodyFormData.append('name', name);
  // bodyFormData.append('birthday', birthday);
  // bodyFormData.append('gender', gender);
  // bodyFormData.append('avatar', avatar);
  return apiToken(ApiConstants.DEVICE_LIST, 'post');
}

export function deviceInfoApi(device_id) {
  //Thông tin thiết bị
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  return apiToken(ApiConstants.DEVICE_INFO, 'post', bodyFormData);
}

export function removeDeviceApi(device_id) {
  //Xoá thiết bị
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  return apiToken(ApiConstants.REMOVE_DEVICE, 'post', bodyFormData);
}

export function deviceHistoryApi(page, perPage, device_id, date, s) {
  //Lịch sử truy cập
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  bodyFormData.append('date', date);
  bodyFormData.append('page', page);
  bodyFormData.append('per_page', perPage);
  if (s) {
    bodyFormData.append('s', s);
  }

  return apiToken(ApiConstants.DEVICE_HISTORY, 'post', bodyFormData);
}

export function deviceReportApi(page, perPage, device_id, date, status, s) {
  //Lịch sử truy cập
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  bodyFormData.append('date', date);
  bodyFormData.append('page', page);
  bodyFormData.append('per_page', perPage);
  if (Number.isInteger(status)) {
    bodyFormData.append('status', status);
  }

  if (s) {
    bodyFormData.append('s', s);
  }

  return apiToken(ApiConstants.DEVICE_REPORT, 'post', bodyFormData);
}

export function deviceUpdateApi(
  device_id,
  is_block,
  full_name,
  birthday,
  gender,
) {
  //Cập nhật thiết bị
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  bodyFormData.append('is_block', is_block);
  if (full_name) {
    bodyFormData.append('full_name', full_name);
  }
  if (birthday) {
    bodyFormData.append('birthday', birthday);
  }
  if (gender) {
    bodyFormData.append('gender', gender);
  }

  return apiToken(ApiConstants.DEVICE_UPDATE, 'post', bodyFormData);
}

export function deviceSettingListApi(device_id) {
  //Danh sách cài đặt thiết bị
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  return apiToken(ApiConstants.DEVICE_SETTING_LIST, 'post', bodyFormData);
}

export function deviceSettingUpdateApi(device_id, setting_id, name, status) {
  //Cập nhật cài đặt thiết bị
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  if (setting_id) {
    bodyFormData.append('setting_id', setting_id);
  }

  bodyFormData.append('name', name);
  bodyFormData.append('status', status);
  return apiToken(ApiConstants.DEVICE_SETTING_UPDATE, 'post', bodyFormData);
}

export function deviceAvatarUpdateApi(device_id, imageBase64) {
  //Cập nhật avatar thiết bị
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  bodyFormData.append('avatar', imageBase64);
  return apiToken(ApiConstants.DEVICE_AVATAR_UPDATE, 'post', bodyFormData);
}
