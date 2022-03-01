import {apiToken} from 'api';
import ApiConstants from '../ApiConstants';

export function webListApi(device_id) {
  //Danh sách web
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  return apiToken(ApiConstants.WEB_LIST, 'post', bodyFormData, null);
}

export function webUpdateApi(web_id, status, url) {
  //Cập nhật web
  let bodyFormData = new FormData();
  bodyFormData.append('web_id', web_id);
  bodyFormData.append('status', status);
  bodyFormData.append('url', url);
  return apiToken(ApiConstants.WEB_UPDATE, 'post', bodyFormData, null);
}

export function webCreateApi(url, status, time_remaining, device_id) {
  //Thêm web
  let bodyFormData = new FormData();
  bodyFormData.append('url', url);
  bodyFormData.append('status', status);
  bodyFormData.append('time_remaining', time_remaining);
  bodyFormData.append('device_id', device_id);
  return apiToken(ApiConstants.WEB_ADD, 'post', bodyFormData, null);
}

export function webDeleteApi(web_id) {
  //Xoá web
  let bodyFormData = new FormData();
  bodyFormData.append('web_id', web_id);
  return apiToken(ApiConstants.WEB_DELETE, 'post', bodyFormData, null);
}

export function webReportAccessApi(device_id, date) {
  //Xoá web
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  bodyFormData.append('date', date);
  return apiToken(ApiConstants.WEB_REPORT_ACCESS, 'post', bodyFormData, null);
}
