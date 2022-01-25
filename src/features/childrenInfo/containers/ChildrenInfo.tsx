import React, {useState} from 'react';
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
import {deviceInfoApi, removeDeviceApi} from 'methods/device';
import {Toast} from 'customs';

export type Props = {
  route?: any;
};

const ChildrenInfo: React.FC<Props> = ({route}) => {
  const params = route?.params;
  const device_id = params?.device_id;

  const queryClient = useQueryClient();

  const [visibleRemoveDevice, setVisibleRemoveDevice] = useState(false);

  const {data} = useQuery(
    keyTypes.DEVICE_INFO + '_' + device_id,
    () => deviceInfoApi(device_id),
    {
      keepPreviousData: true,
    },
  );

  const mutationRemoveDevice = useMutation(
    ({data_device_id}: {data_device_id?: any}) =>
      removeDeviceApi(data_device_id),
  );

  const handleRedirectWebsiteControl = () => {
    RootNavigation.navigate(navigationTypes.websiteControl.screen, {
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

  return (
    <Background bout>
      <Loading isLoading={mutationRemoveDevice.isLoading} />
      <PopupConfirm
        content="Bạn có chắc chắn muốn ngắt kết nối không?"
        visible={visibleRemoveDevice}
        onPressAgree={handleRemoveDevice}
        onPressCancel={() => setVisibleRemoveDevice(false)}
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
        <TouchableHighlight
          onPress={() => setVisibleRemoveDevice(true)}
          underlayColor={colors.COLOR_UNDERLAY_BUTTON_PINK}
          style={styles.btnCancel}>
          <Text style={styles.labelBtnCancel}>Huỷ kết nối</Text>
        </TouchableHighlight>
        <ButtonRedirect
          onPress={handleRedirectWebsiteControl}
          label="Kiếm soát website"
        />
        {/* <ButtonRedirect
          containerStyle={styles.btnRedirect}
          onPress={() => console.log(111)}
          label="Kiếm soát ứng dụng"
        /> */}
        <ButtonRedirect
          containerStyle={styles.btnRedirect}
          onPress={handleRedirectReport}
          label="Lịch sử truy cập"
        />
      </ScrollView>
    </Background>
  );
};

export default ChildrenInfo;
