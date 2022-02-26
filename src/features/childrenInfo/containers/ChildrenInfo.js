import React, {useState, useEffect} from 'react';
import {Text, Background, ButtonBack, Avatar} from 'base';
import {
  View,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
} from 'react-native';
import styles from './styles';
import {commonStyles, colors} from 'styles';
import {ButtonRedirect, PopupConfirm, Loading} from 'components';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import {useQueryClient, useQuery, useMutation} from 'react-query';
import keyTypes from 'keyTypes';
import {
  deviceInfoApi,
  removeDeviceApi,
  deviceSettingListApi,
  deviceSettingUpdateApi,
} from 'methods/device';
import {Toast} from 'customs';
import {ModalSetupAccess, Switch} from '../components';
import FastImage from 'react-native-fast-image';
import images from 'images';
import types from '../types';
import lodash from 'lodash';

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

  const {data, refetch} = useQuery(
    keyTypes.DEVICE_INFO + '_' + device_id,
    () => deviceInfoApi(device_id),
    {
      keepPreviousData: true,
    },
  );

  const {data: dataDeviceSettingList, refetch: refetchDeviceSettingList} =
    useQuery(
      keyTypes.DEVICE_SETTING_LIST + '_' + device_id,
      () => deviceSettingListApi(device_id),
      {
        keepPreviousData: true,
      },
    );

  const mutationUpdate = useMutation(
    ({data_device_id, data_setting_id, data_name, data_status}) =>
      deviceSettingUpdateApi(
        data_device_id,
        data_setting_id,
        data_name,
        data_status,
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
          params.data_status = 1;
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
          params.data_status = 1;
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

  return (
    <Background bin>
      <Loading
        isLoading={mutationRemoveDevice.isLoading || mutationUpdate.isLoading}
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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={colors.COLOR_WHITE}
          />
        }
        style={styles.container}>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Quản lý thông tin
        </Text>
        <View style={styles.wrapAvatar}>
          <Avatar
            containerStyle={styles.avatar}
            imageStyle={styles.avatar}
            uriImage={data?.data?.avatar}
          />
          <View style={styles.wrapInfo}>
            <Text style={[styles.textInfo, styles.infoName]}>
              {data?.data?.full_name}
            </Text>
            <Text style={styles.textInfo}>{data?.data?.device_name}</Text>
            <Text style={styles.textInfo}>
              {data?.data?.status ? 'Đã kết nối' : 'Chưa kết nối'}
            </Text>
          </View>
        </View>
        <View style={styles.wrapBtn}>
          <TouchableHighlight
            onPress={() => setVisibleRemoveDevice(true)}
            underlayColor={colors.COLOR_UNDERLAY_BUTTON_PINK}
            style={styles.btnCancel}>
            <Text style={styles.labelBtnCancel}>Huỷ kết nối</Text>
          </TouchableHighlight>
          {/* <TouchableHighlight
            onPress={() => {
              setVisibleSetup(true);
            }}
            underlayColor={colors.COLOR_UNDERLAY_BLUE}
            style={styles.btnSetup}>
            <Text style={styles.labelBtnSetup}>Thiết lập</Text>
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
              Ngăn chặn quyền truy cập các website người lớn, bạo lực, cờ bạc và
              lừa đảo. {'\n'}Bảo vệ quyền riêng tư và loại bỏ quảng cáo.
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
    </Background>
  );
};

export default ChildrenInfo;
