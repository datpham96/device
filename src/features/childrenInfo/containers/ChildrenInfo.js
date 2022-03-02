import React, {useState, useEffect, useMemo} from 'react';
import {Text, Background, ButtonBack, Avatar} from 'base';
import {
  View,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
} from 'react-native';
import styles from './styles';
import {commonStyles, colors} from 'styles';
import {ButtonRedirect, PopupConfirm, Loading, LoadingData} from 'components';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import {useQueryClient, useQuery, useMutation} from 'react-query';
import keyTypes from 'keyTypes';
import {
  deviceInfoApi,
  removeDeviceApi,
  deviceSettingListApi,
  deviceSettingUpdateApi,
  deviceAvatarUpdateApi,
  deviceUpdateApi,
} from 'methods/device';
import {Toast} from 'customs';
import {ModalSetupAccess, ModalUpdateInfo, Switch} from '../components';
import FastImage from 'react-native-fast-image';
import images from 'images';
import types from '../types';
import lodash from 'lodash';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {checkVar} from 'src/helpers/funcs';
import Validator from 'validatorjs';
import {ChildrenPlaceholder} from '../placeholders';
import moment from 'moment';

const ChildrenInfo = ({route}) => {
  const params = route?.params;
  const device_id = params?.device_id;

  const queryClient = useQueryClient();

  const [visibleRemoveDevice, setVisibleRemoveDevice] = useState(false);
  const [visibleSetup, setVisibleSetup] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [enableSafeSearch, setEnableSafeSearch] = useState(true);
  const [enableSafeWeb, setEnableSafeWeb] = useState(true);
  const [settingType, setSettingType] = useState('');
  const [visibleUpdateInfoModal, setVisibleUpdateInfoModal] = useState(false);

  const [fullName, setFullname] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [dataRequestAvatar, setDataRequestAvatar] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [errors, setErrors] = useState({});

  const {data, refetch, isLoading} = useQuery(
    keyTypes.DEVICE_INFO + '_' + device_id,
    () => deviceInfoApi(device_id),
    // {
    //   keepPreviousData: true,
    // },
  );

  const {data: dataDeviceSettingList, refetch: refetchDeviceSettingList} =
    useQuery(
      keyTypes.DEVICE_SETTING_LIST + '_' + device_id,
      () => deviceSettingListApi(device_id),
      {
        keepPreviousData: true,
      },
    );

  useEffect(() => {
    if (!checkVar.isEmpty(data?.data)) {
      let detail = data.data;
      setFullname(detail.full_name);
      setDeviceName(detail.device_name);
      setGender(detail.gender ? detail.gender : '');
      setBirthday(detail.birthday);
      setAvatarUri({uri: detail.avatar});
    }
  }, [data]);

  const mutationUpdate = useMutation(
    ({data_device_id, data_setting_id, data_name, data_status}) =>
      deviceSettingUpdateApi(
        data_device_id,
        data_setting_id,
        data_name,
        data_status,
      ),
  );

  //cập nhật device avatar
  const mutationDeviceAvatarUpdate = useMutation(
    ({data_device_id, data_avatar}) =>
      deviceAvatarUpdateApi(data_device_id, data_avatar),
  );

  //cập nhật device info
  const mutationDeviceUpdate = useMutation(
    ({
      data_device_id,
      data_is_block,
      data_full_name,
      data_birthday,
      data_gender,
    }) =>
      deviceUpdateApi(
        data_device_id,
        data_is_block,
        data_full_name,
        data_birthday,
        data_gender,
      ),
  );

  const mutationRemoveDevice = useMutation(({data_device_id}) =>
    removeDeviceApi(data_device_id),
  );

  useEffect(() => {
    if (dataDeviceSettingList) {
      let infoSafeWeb = lodash.find(dataDeviceSettingList.data, {
        name: types.safe_web.code,
      });
      let infoSafeSearch = lodash.find(dataDeviceSettingList.data, {
        name: types.safe_search.code,
      });
      if (infoSafeWeb) {
        setEnableSafeWeb(infoSafeWeb.status ? true : false);
      }
      if (infoSafeSearch) {
        setEnableSafeSearch(infoSafeSearch.status ? true : false);
      }
    }
  }, [dataDeviceSettingList]);

  const avatarLink = useMemo(() => {
    let avatar = '';
    if (data?.data?.avatar) {
      avatar = data.data.avatar;
    }
    return avatar;
  }, [data]);

  const handleRedirectWebsiteControl = () => {
    RootNavigation.navigate(navigationTypes.websiteControl.screen, {
      device_id: device_id,
    });
  };

  const handleRedirectApplicationControl = () => {
    RootNavigation.navigate(navigationTypes.applicationControl.screen, {
      device_id: device_id,
    });
  };

  const handleRedirectReport = () => {
    RootNavigation.navigate(navigationTypes.report.screen, {
      device_id: device_id,
    });
  };

  const onRefresh = async () => {
    await queryClient.removeQueries(keyTypes.DEVICE_INFO + '_' + device_id, {
      exact: true,
    });
    await queryClient.removeQueries(
      keyTypes.DEVICE_SETTING_LIST + '_' + device_id,
      {
        exact: true,
      },
    );
    await refetch();
    await refetchDeviceSettingList();
  };

  const handleRemoveDevice = () => {
    setVisibleRemoveDevice(false);
    mutationRemoveDevice
      .mutateAsync({
        data_device_id: device_id,
      })
      .then(resp => {
        if (resp?.status) {
          RootNavigation.goBack();
          Toast('Ngắt kết nối thành công!');
        } else {
          Toast(resp?.msg);
        }
        mutationRemoveDevice.reset();
      })
      .catch(err => {
        Toast(err?.msg);
        mutationRemoveDevice.reset();
      });
  };

  const handleAgreeSettingDevice = () => {
    setVisibleConfirm(false);
    let infoSafeWeb = lodash.find(dataDeviceSettingList.data, {
      name: types.safe_web.code,
    });
    let infoSafeSearch = lodash.find(dataDeviceSettingList.data, {
      name: types.safe_search.code,
    });
    // eslint-disable-next-line no-shadow
    let params = {};
    switch (settingType) {
      case types.safe_web.code:
        if (infoSafeWeb) {
          params.data_device_id = device_id;
          params.data_setting_id = infoSafeWeb.id;
          params.data_name = types.safe_web.code;
          params.data_status = enableSafeWeb ? 1 : 0;
        } else {
          params.data_device_id = device_id;
          params.data_name = types.safe_web.code;
          params.data_status = 0;
        }
        break;
      case types.safe_search.code:
        if (infoSafeSearch) {
          params.data_device_id = device_id;
          params.data_setting_id = infoSafeSearch.id;
          params.data_name = types.safe_search.code;
          params.data_status = enableSafeSearch ? 1 : 0;
        } else {
          params.data_device_id = device_id;
          params.data_name = types.safe_search.code;
          params.data_status = 0;
        }
        break;
    }

    mutationUpdate
      .mutateAsync(params)
      .then(resp => {
        if (resp?.status) {
          Toast('Thiết lập thành công');
          refetchDeviceSettingList();
        } else {
          Toast('Thiết lập không thành công');
        }
        mutationUpdate.reset();
      })
      .catch(() => {
        Toast('Thiết lập không thành công');
        mutationUpdate.reset();
      });
  };
  const handleCancelSettingDevice = () => {
    setVisibleConfirm(false);
    switch (settingType) {
      case types.safe_web.code:
        setEnableSafeWeb(!enableSafeWeb);
        break;
      case types.safe_search.code:
        setEnableSafeSearch(!enableSafeSearch);
        break;
    }
  };

  const handleCloseUpdateInfo = () => {
    setVisibleUpdateInfoModal(false);
    setErrors({});
  };
  const handleUpdateInfo = () => {
    setVisibleUpdateInfoModal(false);
    let validation = new Validator(
      {
        fullName: fullName,
        gender: gender,
        birthday: birthday,
      },
      {
        fullName: 'required',
        gender: 'required',
        birthday: 'required',
      },
      {
        'required.fullName': 'Tên không được bỏ trống',
        'required.gender': 'Giới tính không được bỏ trống',
        'required.birthday': 'Ngày sinh tính không được bỏ trống',
      },
    );
    if (validation.fails()) {
      setErrors({
        ...errors,
        fullName: validation.errors.first('fullName'),
        gender: validation.errors.first('gender'),
        birthday: validation.errors.first('birthday'),
      });
      return;
    }

    if (validation.passes()) {
      setErrors({
        ...errors,
        fullName: validation.errors.first('fullName'),
        gender: validation.errors.first('gender'),
        birthday: validation.errors.first('birthday'),
      });
    }
    //cập nhật avatar
    mutationDeviceAvatarUpdate
      .mutateAsync({
        data_device_id: device_id,
        data_avatar: dataRequestAvatar,
      })
      .then(() => {
        return mutationDeviceUpdate.mutateAsync({
          data_device_id: device_id,
          data_is_block: data?.data?.is_block,
          data_full_name: fullName,
          data_birthday: birthday,
          data_gender: gender,
        });
      })
      .then(resp => {
        if (resp?.status) {
          Toast('Cập nhật thông tin thành công');
          onRefresh();
        } else {
          Toast('Cập nhật thông tin thất bại');
        }
        mutationDeviceAvatarUpdate.reset();
        mutationDeviceUpdate.reset();
      })
      .catch(err => {
        mutationDeviceAvatarUpdate.reset();
        mutationDeviceUpdate.reset();
        console.log(err, 'err==');
      });
  };

  const handleRedirectLicense = () => {
    RootNavigation.navigate(navigationTypes.activated.screen);
  };

  const formatExpiredDate = date => {
    let obj = {
      expired: false,
      date: '',
    };
    if (moment().isAfter(moment(date, 'YYYY-MM-DD HH:mm:ss'), 'days')) {
      obj.date = 'Đã hết hạn';
      obj.expired = true;
    } else {
      obj.date = moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
      obj.expired = false;
    }
    return obj;
  };

  return (
    <Background bin>
      <ModalUpdateInfo
        avatarUri={avatarUri}
        setAvatarUri={val => setAvatarUri(val)}
        errors={errors}
        setDataRequestAvatar={val => setDataRequestAvatar(val)}
        visible={visibleUpdateInfoModal}
        onPressClose={handleCloseUpdateInfo}
        onPressSubmit={handleUpdateInfo}
        nameValue={fullName}
        onChangeName={val => setFullname(val)}
        deviceNameValue={deviceName}
        genderValue={gender}
        onChangeGender={val => setGender(val)}
        birthday={birthday}
        onChangeBirthday={val => setBirthday(val)}
      />
      <Loading
        isLoading={
          mutationRemoveDevice.isLoading ||
          mutationUpdate.isLoading ||
          mutationDeviceUpdate.isLoading
        }
      />
      <ModalSetupAccess
        deviceId={device_id}
        visible={visibleSetup}
        onPressClose={() => setVisibleSetup(false)}
      />
      <PopupConfirm
        content="Bạn có chắc chắn muốn ngắt kết nối không?"
        visible={visibleRemoveDevice}
        onPressAgree={handleRemoveDevice}
        onPressCancel={() => setVisibleRemoveDevice(false)}
      />
      <PopupConfirm
        onPressAgree={handleAgreeSettingDevice}
        onPressCancel={handleCancelSettingDevice}
        visible={visibleConfirm}
        content="Bạn có muốn thực hiện tác vụ này không?"
      />
      <ButtonBack />
      <View style={styles.container}>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Quản lý thông tin
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onRefresh}
              tintColor={colors.COLOR_WHITE}
            />
          }
          style={styles.scrollContainer}>
          {isLoading ? (
            <ChildrenPlaceholder />
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setVisibleUpdateInfoModal(true)}
              style={styles.wrapAvatar}>
              <Avatar
                containerStyle={styles.avatar}
                imageStyle={styles.avatar}
                uriImage={avatarLink}
              />
              <View style={styles.wrapInfo}>
                <Text style={[styles.textInfo, styles.infoName]}>
                  {data?.data?.full_name}
                </Text>
                <Text style={styles.textInfo}>{data?.data?.device_name}</Text>
                <Text style={styles.textInfo}>
                  {data?.data?.status ? 'Đã kết nối' : 'Chưa kết nối'}
                </Text>
                {!checkVar.isEmpty(data?.data?.expire_time) ? (
                  <Text style={styles.textInfo}>
                    Ngày hết hạn:{' '}
                    <Text
                      style={{
                        color: formatExpiredDate(data?.data?.expire_time)
                          ?.expired
                          ? colors.COLOR_ERROR
                          : colors.COLOR_WHITE,
                      }}>
                      {formatExpiredDate(data?.data?.expire_time)?.date}
                    </Text>
                  </Text>
                ) : (
                  'Không giới hạn'
                )}
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.wrapBtn}>
            <TouchableHighlight
              onPress={() => setVisibleRemoveDevice(true)}
              underlayColor={colors.COLOR_UNDERLAY_BUTTON_PINK}
              style={styles.btnCancel}>
              <Text style={styles.labelBtnCancel}>Huỷ kết nối</Text>
            </TouchableHighlight>
            {/* <TouchableHighlight
              onPress={handleRedirectLicense}
              underlayColor={colors.COLOR_UNDERLAY_BLUE}
              style={styles.btnSetup}>
              <Text style={styles.labelBtnSetup}>Bản quyền sử dụng</Text>
            </TouchableHighlight> */}
          </View>
          <ButtonRedirect
            onPress={handleRedirectWebsiteControl}
            label="Kiểm soát website"
          />
          <ButtonRedirect
            containerStyle={styles.btnRedirect}
            onPress={handleRedirectApplicationControl}
            label="Kiếm soát ứng dụng"
          />
          <ButtonRedirect
            containerStyle={styles.btnRedirect}
            onPress={handleRedirectReport}
            label="Lịch sử truy cập"
          />
          <View style={styles.settingContainer}>
            <View style={styles.wrapSafeWeb}>
              <View style={styles.headerSafeWeb}>
                <FastImage
                  style={styles.iconInfo}
                  source={images.icons.safe_web}
                />
                <Text style={styles.labelInfo}>Lướt web an toàn</Text>
                <Switch
                  value={enableSafeWeb}
                  onValueChange={() => {
                    setEnableSafeWeb(!enableSafeWeb);
                    setSettingType(types.safe_web.code);
                    setVisibleConfirm(true);
                  }}
                  containerStyle={styles.switchSafeWeb}
                />
              </View>
              <Text style={styles.contentSafeWeb}>
                Ngăn chặn quyền truy cập các website người lớn, bạo lực, cờ bạc
                và lừa đảo. {'\n'}Bảo vệ quyền riêng tư và loại bỏ quảng cáo.
              </Text>
            </View>
            {/* <Line customStyle={styles.lineOne} /> */}
            <View style={styles.wrapSafeWeb}>
              <View style={styles.headerSafeWeb}>
                <FastImage
                  style={styles.iconInfo}
                  source={images.icons.safe_search}
                />
                <Text style={styles.labelInfo}>Tìm kiếm an toàn</Text>
                <Switch
                  value={enableSafeSearch}
                  onValueChange={() => {
                    setEnableSafeSearch(!enableSafeSearch);
                    setSettingType(types.safe_search.code);
                    setVisibleConfirm(true);
                  }}
                  containerStyle={styles.switchSafeWeb}
                />
              </View>
              <Text style={styles.contentSafeWeb}>
                Lọc bỏ kết quả tìm kiếm có chứa nội dung người lớn, bạo lực, cờ
                bạc và lừa đảo.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Background>
  );
};

export default ChildrenInfo;
