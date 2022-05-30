import React, {Suspense, useState} from 'react';
import {View, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
//node_modules
import FastImage from 'react-native-fast-image';
import {useQuery, useQueryClient, useMutation} from 'react-query';
import {
  PERMISSIONS,
  openSettings,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
import moment from 'moment';
import lodash from 'lodash';
//api
import {deviceListApi, deviceActivationApi} from 'methods/device';
//base
import {Background, Text} from 'base';
//components
import {EmptyData} from 'components';
//config
import images from 'images';
import {colors, commonStyles} from 'styles';
//helpers
import {flashMessage} from 'helpers/funcs';
//HOC
//hooks
//navigation
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import keyTypes from 'keyTypes';
//storages
//redux-stores
//feature
import {ItemChildrenComponent} from '../components';
import styles from './styles';
import {ItemChildrenPlaceholder} from '../placeholders';
import {genders} from 'types';
//code-splitting
const ModalScanQRcode = React.lazy(() =>
  import('src/components/Modals/ModalScanQRcodeComponent'),
);
const PopupConfirm = React.lazy(() =>
  import('src/components/Popups/PopupConfirmComponent'),
);
const ModalWaiting = React.lazy(() =>
  import('src/components/Modals/ModalWaitingComponent'),
);
const PopupAlert = React.lazy(() =>
  import('src/components/Popups/PopupAlertComponent'),
);
//screen

const ChildrenManager = ({navigation}) => {
  const queryClient = useQueryClient();
  const [visibleQrCode, setVisibleQrCode] = useState(false);
  const [visibleActivated, setVisibleActivated] = useState(false);
  const [visiblePermissionCamera, setVisiblePermissionCamera] = useState(false);
  const [visibleWaitingModal, setVisibleWaitingModal] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [visiblePopupUpdateDevice, setVisiblePopupUpdateDevice] =
    useState(false);

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
    keyTypes.DEVICE_LIST_MANAGER,
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

  //xử lý khi out khỏi màn hình hiện tại
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      queryClient.cancelQueries(keyTypes.DEVICE_LIST_MANAGER);
    });
    return unsubscribe;
  }, [navigation, queryClient]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const onRefresh = async () => {
    await queryClient.removeQueries(keyTypes.DEVICE_LIST_MANAGER, {
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
            setVisibleWaitingModal(true);
            setVisibleQrCode(false);
          } else {
            if (!resp?.imei_invalid) {
              setVisibleQrCode(false);
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
          flashMessage.error(err?.msg);
          mutationActivatedDevice.reset();
        });
    } else {
      flashMessage.error('Mã QR thiết bị không hợp lệ');
    }
  };

  const handleDetail = item => {
    refetch();
    if (data?.data && data?.data?.length > 0) {
      let tmpDeviceInfo = lodash.find(data?.data, {id: item?.id});
      if (tmpDeviceInfo?.is_update) {
        setVisiblePopupUpdateDevice(true);
        setDeviceInfo(tmpDeviceInfo);
      } else {
        RootNavigation.navigate(navigationTypes.childrenInfo.screen, {
          device_id: item?.id,
        });
      }
    }
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
      <Suspense fallback={<></>}>
        {visiblePopupUpdateDevice && (
          <PopupAlert
            visible={visiblePopupUpdateDevice}
            onPressCancel={() => setVisiblePopupUpdateDevice(false)}
            content={`Vui lòng cập nhật phần mềm SafeZone trên thiết bị con (${deviceInfo?.full_name}) lên phiên bản mới nhất để tiếp sử dụng`}
          />
        )}
        {visibleWaitingModal && (
          <ModalWaiting
            onPressCancel={handleRedirectDeviceUpdate}
            visible={visibleWaitingModal}
          />
        )}
        {visiblePermissionCamera && (
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
        )}
        {visibleActivated && (
          <PopupConfirm
            labelBtnLeft="Xác nhận"
            labelBtnRight="Huỷ"
            notiLabel="Bản quyền sử dụng"
            content={
              'Thời gian sử dụng của bạn đã hết vui lòng \n nhập bản quyền'
            }
            visible={visibleActivated}
            onPressCancel={() => setVisibleActivated(false)}
            srcImage={images.logos.activated_lock}
            onPressAgree={() => {
              setVisibleActivated(false);
              RootNavigation.navigate(navigationTypes.activated.screen);
            }}
          />
        )}
        {visibleQrCode && (
          <ModalScanQRcode
            visible={visibleQrCode}
            onPressClose={() => setVisibleQrCode(false)}
            onSuccessQRCode={val => handleSucessQRCode(val)}
          />
        )}
      </Suspense>
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
