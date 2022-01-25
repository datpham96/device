import * as types from '../constants';

const initialState = {
  isLoadingUserInfo: false,
  isLoadingUpdateUserAvatar: false,
  isLoadingUpdateUserInfo: false,
  isLoadingChangePassword: false,
  statusChangePassword: false,
  userInfo: {},
  errors: {
    msg: null,
  },
};

const userReducers = (state = initialState, action) => {
  switch (action.type) {
    //get user info
    case types.USER_INFO.REQUEST:
      return {
        ...state,
        isLoadingUserInfo: true,
      };
    case types.USER_INFO.SUCCESS:
      return {
        ...state,
        isLoadingUserInfo: false,
        userInfo: action?.payload?.userInfo,
        errors: {...state.errors, msg: null},
      };
    case types.USER_INFO.FAILURE:
      return {
        ...state,
        isLoadingUserInfo: false,
        userInfo: {},
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.USER_INFO.RESET:
      return {
        ...state,
        isLoadingUserInfo: false,
        userInfo: {},
        errors: {...state.errors, msg: null},
      };
    //update avatar
    case types.USER_AVATAR.REQUEST:
      return {
        ...state,
        isLoadingUpdateUserAvatar: true,
      };
    case types.USER_AVATAR.SUCCESS:
      return {
        ...state,
        isLoadingUpdateUserAvatar: false,
        statusUpdateUserAvatar: true,
        userInfo: {...state.userInfo, image: action?.payload?.image},
        errors: {...state.errors, msg: null},
      };
    case types.USER_AVATAR.FAILURE:
      return {
        ...state,
        isLoadingUpdateUserAvatar: false,
        statusUpdateUserAvatar: false,
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.USER_AVATAR.RESET:
      return {
        ...state,
        isLoadingUpdateUserAvatar: false,
        statusUpdateUserAvatar: false,
        errors: {...state.errors, msg: null},
      };
    //update user info
    case types.UPDATE_USER_INFO.REQUEST:
      return {
        ...state,
        isLoadingUpdateUserInfo: true,
      };
    case types.UPDATE_USER_INFO.SUCCESS:
      return {
        ...state,
        isLoadingUpdateUserInfo: false,
        statusUpdateUserInfo: true,
        userInfo: {...state.userInfo, name: action?.payload?.name},
        errors: {...state.errors, msg: null},
      };
    case types.UPDATE_USER_INFO.FAILURE:
      return {
        ...state,
        isLoadingUpdateUserInfo: false,
        statusUpdateUserInfo: false,
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.UPDATE_USER_INFO.RESET:
      return {
        ...state,
        isLoadingUpdateUserInfo: false,
        statusUpdateUserInfo: false,
        errors: {...state.errors, msg: null},
      };
    //change password
    case types.CHANGE_PASSWORD.REQUEST:
      return {
        ...state,
        isLoadingChangePassword: true,
      };
    case types.CHANGE_PASSWORD.SUCCESS:
      return {
        ...state,
        isLoadingChangePassword: false,
        statusChangePassword: true,
        errors: {...state.errors, msg: null},
      };
    case types.CHANGE_PASSWORD.FAILURE:
      return {
        ...state,
        isLoadingChangePassword: false,
        statusChangePassword: false,
        errors: {...state.errors, msg: action?.payload?.msg},
      };
    case types.CHANGE_PASSWORD.RESET:
      return {
        ...state,
        isLoadingChangePassword: false,
        statusChangePassword: false,
        errors: {...state.errors, msg: null},
      };
    default:
      return state;
  }
};

export default userReducers;
