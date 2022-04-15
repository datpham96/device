import {apiToken} from 'api';
import ApiConstants from '../ApiConstants';

export function applicationListApi(device_id) {
  //Danh sách ứng dụng
  let bodyFormData = new FormData();
  bodyFormData.append('device_id', device_id);
  return apiToken(ApiConstants.APPLICATION_LIST, 'post', bodyFormData, null);
}

export function applicationUpdateApi(app_id, status, timeList) {
  //Cập nhật ứng dụng
  let bodyFormData = new FormData();
  bodyFormData.append('app_id', app_id);
  bodyFormData.append('status', status);

  if (timeList) {
    timeList.map((item, key) => {
      bodyFormData.append('timer[' + key + '][day]', item.day);
      bodyFormData.append('timer[' + key + '][start_time]', item.start_time);
      bodyFormData.append('timer[' + key + '][end_time]', item.end_time);
      bodyFormData.append('timer[' + key + '][status]', item.status);
    });
  }
  return apiToken(ApiConstants.APPLICATION_UPDATE, 'post', bodyFormData, null);
}
