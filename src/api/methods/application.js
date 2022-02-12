import {apiToken} from 'api';
import ApiConstants from '../ApiConstants';

export function applicationListApi(device_id) {
  //Danh sách ứng dụng
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  return apiToken(ApiConstants.APPLICATION_LIST, 'post', bodyFormData, null);
}

export function applicationUpdateApi(app_id, status, time_remaining) {
  //Cập nhật ứng dụng
  let bodyFormData = new FormData();
  bodyFormData.append('app_id', app_id);
  bodyFormData.append('status', status);
  bodyFormData.append('time_remaining', time_remaining);
  return apiToken(ApiConstants.APPLICATION_UPDATE, 'post', bodyFormData, null);
}
