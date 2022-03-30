import env from 'src/environment';

const ApiConstants = {
  //url
  BASE_URL: env.host + '/api/',

  //path login
  LOGIN: 'login', //đăng nhập
  REGISTER: 'register', //tạo tài khoản
  FOGOT_PASSWORD: 'user/forgetPassword', //quên mật khẩu
  RESET_PASSWORD: 'user/resetPassword', //làm mới mật khẩu
  VERIFY_OTP: 'mobile/verify', //xác thực OTP

  //path user info
  USER_INFO: 'info', //thông tin tài khoản
  UPDATE_USER_INFO: 'user/update', //cập nhật thông tin tài khoản
  UPDATE_USER_AVATAR: 'user/changeAvatar', //cập nhật avatar của tài khoản
  CHANGE_USER_PASSWORD: 'user/changePassword', //cập nhật mật khẩu của tài khoản

  //path web
  WEB_ADD: 'application/webAdd', //thêm website
  WEB_UPDATE: 'application/webUpdate', //cập nhật website
  WEB_DELETE: 'application/webDelete', //xoá website
  WEB_LIST: 'application/webList', //danh sách website
  WEB_REPORT_ACCESS: 'history/webAccessStatistics', //thống kê truy cập

  //path application
  APPLICATION_UPDATE: 'application/appUpdate', //cập nhật application
  APPLICATION_LIST: 'application/appList', //danh sách application

  //path device
  DEVICE_ACTIVATION: 'device/activeDevice', //kích hoạt thiết bị
  DEVICE_LIST: 'device/list', //Danh sách thiết bị
  DEVICE_INFO: 'device/detail', //Thông tin thiết bị
  REMOVE_DEVICE: 'device/deleteDevice', //Xoá thiết bị

  DEVICE_UPDATE: 'device/update', //Cập nhật thiết bị
  DEVICE_SETTING_LIST: 'settingDevice/list', //Danh sách cài đặt thiết bị
  DEVICE_SETTING_UPDATE: 'settingDevice/update', //Cập nhật cài đặt thiết bị
  DEVICE_AVATAR_UPDATE: 'device/changeAvatar', //Cập nhật cài đặt thiết bị
  DEVICE_LICENSE_KEY_UPDATE: 'device/updateLisenceKey', //Cập nhật license key
  DEVICE_TIMER_ACCESS_UPDATE: 'device/updateTimer', //Cập nhật thời gian truy cấp cho thiết bị,

  //Path history
  DEVICE_HISTORY: 'history/listWebHistory', //Lịch sử truy cập web
};

export default ApiConstants;
