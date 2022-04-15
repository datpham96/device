import React, {useState, useEffect, useMemo} from 'react';
import {Text, Background, ButtonBack, Avatar} from 'base';
import {
  View,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
  Platform,
  UIManager,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import {commonStyles, colors, sizes} from 'styles';
import {ButtonRedirect, PopupConfirm, Loading} from 'components';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import {useQueryClient, useQuery, useMutation} from 'react-query';
import keyTypes from 'keyTypes';
import {
  deviceInfoApi,
  removeDeviceApi,
  deviceAvatarUpdateApi,
  deviceUpdateApi,
} from 'methods/device';
import {Toast} from 'customs';
import {ModalLimitTimeUseDevice, ModalUpdateInfo, Safe} from '../components';
import {checkVar} from 'src/helpers/funcs';
import Validator from 'validatorjs';
import {ChildrenPlaceholder} from '../placeholders';
import moment from 'moment';

const ChildrenInfo = ({route}) => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const params = route?.params;
  const device_id = params?.device_id;

  const queryClient = useQueryClient();

  const [visibleRemoveDevice, setVisibleRemoveDevice] = useState(false);
  const [visibleUpdateInfoModal, setVisibleUpdateInfoModal] = useState(false);

  const [fullName, setFullname] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [dataRequestAvatar, setDataRequestAvatar] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [errors, setErrors] = useState({});
  const [visibleLimitTimeUseModal, setVisibleLimitTimeUseModal] =
    useState(false);

  const {data, refetch, isLoading} = useQuery(
    [keyTypes.DEVICE_INFO, device_id],
    () => deviceInfoApi(device_id),
  );

  useEffect(() => {
    if (!checkVar.isEmpty(data?.data)) {
      let detail = data?.data;
      setFullname(detail?.full_name);
      setDeviceName(detail?.device_name);
      setGender(detail?.gender);
      setAvatarUri({uri: detail?.avatar});
      if (moment(detail?.birthday, 'YYYY-MM-DD').isValid()) {
        setBirthday(
          moment(detail?.birthday, 'YYYY-MM-DD').format('DD-MM-YYYY'),
        );
      } else {
        setBirthday(moment());
      }
    }
  }, [data]);

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

  const avatarLink = useMemo(() => {
    let avatar = '';
    if (data?.data?.avatar) {
      avatar = data?.data?.avatar;
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
    await queryClient.removeQueries([keyTypes.DEVICE_INFO, device_id], {
      exact: true,
    });
    await refetch();
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

  const handleCloseUpdateInfo = () => {
    setVisibleUpdateInfoModal(false);
    setErrors({});
  };
  const handleUpdateInfo = () => {
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
      setVisibleUpdateInfoModal(false);
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
          data_birthday: moment(birthday, 'DD/MM/YYYY').format('YYYY-MM-DD'),
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
        Toast(err?.msg);
      });
  };

  const handleRedirectLicense = () => {
    let licenseKey = data?.data?.license_key;
    let licenseExpired = data?.data?.expire_time;
    RootNavigation.navigate(navigationTypes.activated.screen, {
      license_key: licenseKey,
      license_key_expired: licenseExpired,
      device_id: device_id,
    });
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

  console.log(111111);

  return (
    <Background bin>
      <ModalLimitTimeUseDevice
        onRequestCloseModal={() => {
          setVisibleLimitTimeUseModal(false);
        }}
        onSuccessTimer={() => refetch()}
        deviceId={device_id}
        onPressClose={() => {
          setVisibleLimitTimeUseModal(false);
        }}
        visible={visibleLimitTimeUseModal}
        itemList={data?.data}
      />
      <ModalUpdateInfo
        onRequestCloseModal={handleCloseUpdateInfo}
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
        onChangeBirthday={val => setBirthday(val)}
        birthdayValue={birthday}
      />
      <Loading
        isLoading={
          mutationRemoveDevice?.isLoading || mutationDeviceUpdate?.isLoading
        }
      />
      <PopupConfirm
        content="Bạn có chắc chắn muốn ngắt kết nối không?"
        visible={visibleRemoveDevice}
        onPressAgree={handleRemoveDevice}
        onPressCancel={() => setVisibleRemoveDevice(false)}
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
          <View>
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
                          fontSize: sizes.SIZE_13,
                        }}>
                        {formatExpiredDate(data?.data?.expire_time)?.date}
                      </Text>
                    </Text>
                  ) : (
                    <Text style={styles.textInfo}>Không giới hạn</Text>
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
              {data?.data?.license_key && (
                <TouchableHighlight
                  onPress={handleRedirectLicense}
                  underlayColor={colors.COLOR_UNDERLAY_BLUE}
                  style={styles.btnSetup}>
                  <Text style={styles.labelBtnSetup}>Bản quyền sử dụng</Text>
                </TouchableHighlight>
              )}
            </View>
            <ButtonRedirect
              onPress={() => setVisibleLimitTimeUseModal(true)}
              label="Giới hạn thời gian"
            />
            <ButtonRedirect
              containerStyle={styles.btnRedirect}
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
          </View>
          <Safe deviceId={device_id} />
        </ScrollView>
      </View>
    </Background>
  );
};

export default ChildrenInfo;
