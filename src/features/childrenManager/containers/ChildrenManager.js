import React, {useState} from 'react';
import {Background, Text} from 'base';
import {View, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import {colors, commonStyles} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {ItemChildrenComponent} from '../components';
import styles from './styles';
import {
  ModalScanQRcode,
  EmptyData,
  PopupConfirm,
  ModalWaiting,
} from 'components';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import {Toast} from 'customs';
import {useQuery, useQueryClient, useMutation} from 'react-query';
import keyTypes from 'keyTypes';
import {deviceListApi, deviceActivationApi} from 'methods/device';
import {ItemChildrenPlaceholder} from '../placeholders';
import {
  PERMISSIONS,
  openSettings,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
import moment from 'moment';
import {genders} from 'types';

const ChildrenManager = ({navigation}) => {
  const queryClient = useQueryClient();
  const [visibleQrCode, setVisibleQrCode] = useState(false);
  const [visibleActivated, setVisibleActivated] = useState(false);
  const [visiblePermissionCamera, setVisiblePermissionCamera] = useState(false);
  const [visibleWaitingModal, setVisibleWaitingModal] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});

  const mutationActivatedDevice = useMutation(
    ({
      data_imei,
      data_device_info,
      data_name,
      data_birthday,
      data_gender,
      data_avatar,
    }) =>
      deviceActivationApi(
        data_imei,
        data_device_info,
        data_name,
        data_birthday,
        data_gender,
        data_avatar,
      ),
  );

  const {data, isLoading, refetch} = useQuery(
    keyTypes.DEVICE_LIST + '_MANAGER',
    () => deviceListApi(),
    {
      keepPreviousData: true,
      // onSuccess: lists => {
      //   lists?.data.forEach((item: any) => {
      //     queryClient.setQueryData([keyTypes.DEVICE_INFO, item.id], item);
      //   });
      // },
    },
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const onRefresh = async () => {
    await queryClient.removeQueries(keyTypes.DEVICE_LIST + '_MANAGER', {
      exact: true,
    });
    await refetch();
  };

  const handleRedirectQrCode = () => {
    //check permission camera
    requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.ANDROID.CAMERA]).then(
      result => {
        if (
          result[PERMISSIONS.IOS.CAMERA] === RESULTS.BLOCKED ||
          result[PERMISSIONS.IOS.CAMERA] === RESULTS.DENIED ||
          result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.BLOCKED ||
          result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.DENIED
        ) {
          setVisiblePermissionCamera(true);
        }
        if (
          result[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED ||
          result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED
        ) {
          setVisibleQrCode(true);
          setVisiblePermissionCamera(false);
        }
      },
    );
  };

  const handleSucessQRCode = result => {
    if (JSON.parse(result?.data)?.SerialNumber) {
      setDeviceInfo({});
      // RootNavigation.navigate(navigationTypes.deviceInfo.screen, {
      //   device_info: JSON.parse(result?.data),
      //   children_name: 'Máy ' + (data?.data?.length + 1),
      // });
      const tmpDeviceInfo = JSON.parse(result?.data);
      //thực hiện kích hoạt
      mutationActivatedDevice
        .mutateAsync({
          data_imei: tmpDeviceInfo?.SerialNumber,
          data_device_info: tmpDeviceInfo,
          data_name: 'Máy ' + (data?.data?.length + 1),
          data_birthday: moment().format('DD/MM/YYYY'),
          data_gender: genders?.[0]?.value,
          data_avatar: '',
        })
        .then(resp => {
          if (resp?.status) {
            setDeviceInfo({
              ...deviceInfo,
              deviceId: resp?.device_id,
              deviceInfo: tmpDeviceInfo,
            });
            // refetch();
            // Toast(resp?.msg);
            // RootNavigation.navigate(navigationTypes.childrenManager.screen);
            setVisibleWaitingModal(true);
            setVisibleQrCode(false);
          } else {
            if (!resp?.imei_invalid) {
              RootNavigation.navigate(navigationTypes.imei.screen, {
                imei: tmpDeviceInfo?.SerialNumber,
                name: 'Máy ' + (data?.data?.length + 1),
                deviceName: tmpDeviceInfo?.ManufacturerName,
                birthday: moment().format('DD/MM/YYYY'),
                gender: genders?.[0]?.value,
                dataRequestAvatar: '',
                deviceInfo: tmpDeviceInfo,
              });
            }
          }
          mutationActivatedDevice.reset();
        })
        .catch(err => {
          Toast(err?.msg);
          mutationActivatedDevice.reset();
        });
    } else {
      Toast('Mã QR thiết bị không hợp lệ');
    }
  };

  const handleDetail = item => {
    RootNavigation.navigate(navigationTypes.childrenInfo.screen, {
      device_id: item?.id,
    });
    // if (item.is_block) {
    //   setVisibleActivated(true);
    // } else {
    //   RootNavigation.navigate(navigationTypes.childrenInfo.screen, {
    //     device_id: item.id,
    //   });
    // }
  };

  const handleSetting = () => {
    setVisiblePermissionCamera(false);
    openSettings().catch(() => console.warn('cannot open settings'));
  };

  const handleRedirectDeviceUpdate = () => {
    if (deviceInfo) {
      setVisibleWaitingModal(false);
      RootNavigation.navigate(navigationTypes.deviceInfo.screen, {
        device_info: deviceInfo?.deviceInfo,
        device_id: deviceInfo?.deviceId,
        children_name: 'Máy ' + (data?.data?.length + 1),
      });
    } else {
      refetch();
    }
  };

  return (
    <Background bout>
      <ModalWaiting
        onPressCancel={handleRedirectDeviceUpdate}
        visible={visibleWaitingModal}
      />
      <PopupConfirm
        labelBtnLeft="Cài đặt"
        labelBtnRight="Huỷ"
        visible={visiblePermissionCamera}
        content={
          'SafeZone muốn truy cập máy ảnh của bạn để quét mã QRCode, vui lòng cho phép truy cập máy ảnh của bạn \n Settings > SafeZone > Camera'
        }
        onPressCancel={() => {
          setVisiblePermissionCamera(false);
        }}
        onPressAgree={handleSetting}
      />
      <PopupConfirm
        labelBtnLeft="Xác nhận"
        labelBtnRight="Huỷ"
        notiLabel="Bản quyền sử dụng"
        content={'Thời gian sử dụng của bạn đã hết vui lòng \n nhập bản quyền'}
        visible={visibleActivated}
        onPressCancel={() => setVisibleActivated(false)}
        srcImage={images.logos.activated_lock}
        onPressAgree={() => {
          setVisibleActivated(false);
          RootNavigation.navigate(navigationTypes.activated.screen);
        }}
      />
      <ModalScanQRcode
        visible={visibleQrCode}
        onPressClose={() => setVisibleQrCode(false)}
        onSuccessQRCode={val => handleSucessQRCode(val)}
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={commonStyles.mainTitle}>Gia đình</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.wrapBtnQrCode}
            onPress={handleRedirectQrCode}>
            <FastImage
              style={styles.iconQrCode}
              source={images.icons.qr_code}
            />
            <Text style={styles.labelQrCode}>Quét mã</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View style={[commonStyles.flex1, styles.flatListStyle]}>
            {[1, 2, 3, 4].map(item => {
              return (
                <View key={item}>
                  <ItemChildrenPlaceholder />
                </View>
              );
            })}
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyData />}
            contentContainerStyle={styles.contentContainerFlatlist}
            style={[commonStyles.flex1, styles.flatListStyle]}
            data={data?.data}
            keyExtractor={item => item?.id.toString() + item?.avatar}
            renderItem={({item}) => (
              <ItemChildrenComponent
                onPress={() => handleDetail(item)}
                item={item}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh}
                tintColor={colors.COLOR_WHITE}
              />
            }
          />
        )}
      </View>
    </Background>
  );
};

export default ChildrenManager;
