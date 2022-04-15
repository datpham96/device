import {apiToken} from 'api';
import ApiConstants from '../ApiConstants';

export function webListApi(device_id) {
  //Danh sách web
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  return apiToken(ApiConstants.WEB_LIST, 'post', bodyFormData, null);
}

export function webUpdateApi(web_id, status, url, timeList) {
  //Cập nhật web
  let bodyFormData = new FormData();
  bodyFormData.append('web_id', web_id);
  bodyFormData.append('status', status);
  if (url) {
    bodyFormData.append('url', url);
  }

  if (timeList) {
    timeList.map((item, key) => {
      bodyFormData.append('timer[' + key + '][day]', item.day);
      bodyFormData.append('timer[' + key + '][start_time]', item.start_time);
      bodyFormData.append('timer[' + key + '][end_time]', item.end_time);
      bodyFormData.append('timer[' + key + '][status]', item.status);
    });
  }
  return apiToken(ApiConstants.WEB_UPDATE, 'post', bodyFormData, null);
}

export function webCreateApi(url, status, device_id, timeList) {
  //Thêm web
  let bodyFormData = new FormData();
  bodyFormData.append('url', url);
  bodyFormData.append('status', status);
  bodyFormData.append('device_id', device_id);
  if (timeList) {
    timeList.map((item, key) => {
      bodyFormData.append('timer[' + key + '][day]', item.day);
      bodyFormData.append('timer[' + key + '][start_time]', item.start_time);
      bodyFormData.append('timer[' + key + '][end_time]', item.end_time);
      bodyFormData.append('timer[' + key + '][status]', item.status);
    });
  }

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
