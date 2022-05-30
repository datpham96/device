import React, {useState, useMemo, useEffect, useRef, Suspense} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  AppState,
  Animated,
  Easing,
} from 'react-native';
//node_modules
import {useQuery, useMutation} from 'react-query';
import lodash from 'lodash';
import {
  requestMultiple,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import Geocoder from 'react-native-geocoder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from 'react-query';
//api
import {deviceListApi, deviceUpdateApi} from 'methods/device';
//base
import {Text, Background} from 'base';
//components
import {LoadingData, Loading, EmptyData} from 'components';
//config
import {commonStyles, colors, sizes} from 'styles';
import images from 'images';
//helpers
import {checkVar, flashMessage} from 'helpers/funcs';
//HOC
//hooks
//navigation
import keyTypes from 'keyTypes';
import navigationTypes from 'navigationTypes';
//storages
//redux-stores
//feature
import {MapMarker} from '../components';
import styles from './styles';
//code-splitting
const PopupConfirm = React.lazy(() =>
  import('src/components/Popups/PopupConfirmComponent'),
);
const DropdownSelected = React.lazy(() =>
  import('src/components/Dropdown/SelectedComponent'),
);
//screen
const Location = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const rotateAni = new Animated.Value(0);
  const clickBtnTimoutRef = useRef(null);
  const [selectedDevice, setSelectedDevice] = useState({
    label: '',
    value: '',
    is_block: 0,
    position_time: '',
  });
  const [refresh, setRefresh] = useState(0);
  const [markers, serMarkers] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [visibleConfirmDeviceBlock, setVisibleConfirmDeviceBlock] =
    useState(false);
  const [visiblePermissionLocation, setVisiblePermissionLocation] =
    useState(false);
  const [toggleDropDownSelected, setToggleDropDownSelected] = useState(false);
  const [visibleDeviceUnLock, setVisibleDeviceUnLock] = useState(false);

  const {data, isSuccess, isLoading, refetch, isRefetching} = useQuery(
    keyTypes.DEVICE_LIST_LOCATION,
    () => deviceListApi(),
  );

  const mutationDeviceLockAndUnlock = useMutation(
    ({data_device_id, data_is_block}) =>
      deviceUpdateApi(data_device_id, data_is_block),
  );

  //xử lý khi out khỏi màn hình hiện tại
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      queryClient.cancelQueries(keyTypes.DEVICE_LIST_LOCATION);
    });
    return unsubscribe;
  }, [navigation, queryClient]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // get device list when focus screen
      refetch();
      if (deviceList?.length > 0) {
        requestMultiple([
          PERMISSIONS.IOS.LOCATION_ALWAYS,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]).then(result => {
          if (
            (result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.BLOCKED &&
              result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                RESULTS.BLOCKED) ||
            (result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.DENIED &&
              result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                RESULTS.DENIED) ||
            result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
              RESULTS.DENIED ||
            result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.BLOCKED
          ) {
            serMarkers({
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            });
            setVisiblePermissionLocation(true);
          }
          if (
            result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.GRANTED ||
            result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED ||
            result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
          ) {
            setRefresh(prev => prev + 1);
          }
        });
      }
    });
    return unsubscribe;
  }, [navigation, refresh, deviceList, refetch]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', status => {
      if (status === 'active') {
        if (deviceList?.length > 0) {
          requestMultiple([
            PERMISSIONS.IOS.LOCATION_ALWAYS,
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ]).then(result => {
            if (
              (result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.BLOCKED &&
                result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                  RESULTS.BLOCKED) ||
              (result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.DENIED &&
                result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                  RESULTS.DENIED) ||
              result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
                RESULTS.DENIED ||
              result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
                RESULTS.BLOCKED
            ) {
              serMarkers({
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              });
              setVisiblePermissionLocation(true);
            }
            if (
              result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.GRANTED ||
              result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                RESULTS.GRANTED ||
              result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
                RESULTS.GRANTED
            ) {
              setRefresh(prev => prev + 1);
            }
          });
        }
      }
    });

    return listener.remove;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceList]);

  useEffect(() => {
    if (selectedDevice && data?.data) {
      let deviceInfo = lodash.find(data?.data, {id: selectedDevice?.value});
      if (
        deviceInfo &&
        checkVar.isEmpty(deviceInfo?.latitude) &&
        checkVar.isEmpty(deviceInfo?.longitude)
      ) {
        // Alert.alert('Thông báo', 'Không tìm thấy vị trí trên bản đồ', [
        //   {
        //     text: 'Đóng',
        //     // onPress: () => console.log('Cancel Pressed'),
        //     style: 'cancel',
        //   },
        // ]);
      }
      if (
        deviceInfo &&
        !checkVar.isEmpty(deviceInfo?.latitude) &&
        !checkVar.isEmpty(deviceInfo?.longitude)
      ) {
        Geocoder.geocodePosition({
          lat: parseFloat(deviceInfo?.latitude),
          lng: parseFloat(deviceInfo?.longitude),
          // lat: 20.997732522041,
          // lng: 105.79460466103,
        })
          .then(resp => {
            if (resp && resp[0]) {
              serMarkers({
                latitude: parseFloat(deviceInfo?.latitude),
                longitude: parseFloat(deviceInfo?.longitude),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
                avatar: deviceInfo?.avatar,
                address: resp?.[0]?.formattedAddress,
              });
            }
          })
          .catch(err => {
            console.log(err, 'err----');
          });
      } else {
        serMarkers({
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
      }
    }
  }, [selectedDevice, data, refresh]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      let listDevice = [];
      data.data.map(item => {
        listDevice.push({
          label: item?.full_name,
          value: item?.id,
          is_block: item?.is_block,
          position_time: item?.position_time,
        });
      });
      if (
        listDevice.length > 0 &&
        checkVar.isEmpty(selectedDevice?.label) &&
        checkVar.isEmpty(selectedDevice?.value)
      ) {
        setSelectedDevice(listDevice?.[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  const deviceList = useMemo(() => {
    let tmpSelectList = [];
    if (isSuccess && data?.data) {
      data?.data.map(item => {
        tmpSelectList.push({
          label: item?.full_name,
          value: item?.id,
          is_block: item?.is_block,
          latitude: item?.latitude,
          longitude: item?.longitude,
          position_time: item?.position_time,
        });
      });
    }
    return tmpSelectList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, isRefetching]);

  const handleRotate = () => {
    if (clickBtnTimoutRef.current) {
      clearTimeout(clickBtnTimoutRef.current);
    }
    clickBtnTimoutRef.current = setTimeout(() => {
      rotateAni.setValue(0);
      Animated.timing(rotateAni, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(result => {
        if (result?.finished) {
          refetch();
          let refreshDeviceInfo = lodash.find(deviceList, {
            value: selectedDevice?.value,
          });
          setRefresh(prev => prev + 1);
          setSelectedDevice(refreshDeviceInfo);
        }
      });
    }, 200);
  };

  const rotatePolate = rotateAni.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSetting = () => {
    setVisiblePermissionLocation(false);
    openSettings().catch(() => console.warn('cannot open settings'));
  };

  const handleDeviceLockAndUnlock = () => {
    if (!selectedDevice) {
      flashMessage.error('Vui lòng chọn thiết bị');
      return;
    }
    setVisibleConfirmDeviceBlock(false);
    setVisibleDeviceUnLock(false);

    mutationDeviceLockAndUnlock
      .mutateAsync({
        data_device_id: selectedDevice?.value,
        data_is_block: selectedDevice?.is_block ? 0 : 1,
      })
      .then(resp => {
        if (resp?.status) {
          if (selectedDevice?.is_block) {
            flashMessage.success('Mở khoá thiết bị thành công');
          } else {
            flashMessage.success('Khoá thiết bị thành công');
          }

          refetch();
          setSelectedDevice({
            label: selectedDevice?.label,
            value: selectedDevice?.value,
            is_block: selectedDevice?.is_block ? 0 : 1,
            position_time: selectedDevice?.position_time,
          });
        } else {
          flashMessage.error(resp?.msg);
        }
        mutationDeviceLockAndUnlock.reset();
      })
      .catch(err => {
        flashMessage.error(err?.msg);
        mutationDeviceLockAndUnlock.reset();
      });
  };

  const handleSelectedDevice = item => {
    setSelectedDevice(item);
    setToggleDropDownSelected(false);
  };

  let isCheckMarker = isSuccess && deviceList?.length > 0;

  return (
    <Background bottomTab bout>
      <Loading isLoading={handleDeviceLockAndUnlock?.isLoading} />
      <Suspense fallback={<></>}>
        {visibleConfirmDeviceBlock && (
          <PopupConfirm
            labelBtnLeft="Xác nhận"
            labelBtnRight="Huỷ"
            notiLabel="Khoá thiết bị"
            content={
              'Thiết bị của trẻ sẽ bị khóa toàn bộ. \n Bạn có muốn thực hiện điều này!'
            }
            visible={visibleConfirmDeviceBlock}
            onPressCancel={() => setVisibleConfirmDeviceBlock(false)}
            srcImage={images.logos.activated_lock}
            onPressAgree={handleDeviceLockAndUnlock}
          />
        )}
        {visibleDeviceUnLock && (
          <PopupConfirm
            labelBtnLeft="Có"
            labelBtnRight="Không"
            visible={visibleDeviceUnLock}
            content="Bạn có chắc chắn muốn mở khoá thiết bị này không"
            onPressCancel={() => {
              setVisibleDeviceUnLock(false);
            }}
            onPressAgree={handleDeviceLockAndUnlock}
          />
        )}
        {visiblePermissionLocation && (
          <PopupConfirm
            labelBtnLeft="Cài đặt"
            labelBtnRight="Huỷ"
            visible={visiblePermissionLocation}
            content="SafeZone muốn truy cập vị trí của bạn, Vui lòng bật định vị ứng dụng để tiếp tục sử dụng"
            onPressCancel={() => {
              setVisiblePermissionLocation(false);
              navigation.jumpTo(navigationTypes.home.screen);
            }}
            onPressAgree={handleSetting}
          />
        )}
      </Suspense>
      <View style={styles.container}>
        <View style={styles.wrapMainTitle}>
          <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
            Định vị thiết bị
          </Text>
          {deviceList?.length > 0 && (
            <TouchableOpacity activeOpacity={0.9} onPress={handleRotate}>
              <Animated.Image
                source={images.icons.refresh}
                style={[
                  styles.iconRefresh,
                  {
                    transform: [
                      {
                        rotateZ: rotatePolate,
                      },
                    ],
                  },
                ]}
              />
            </TouchableOpacity>
          )}
        </View>
        {deviceList?.length > 0 && (
          <View style={styles.wrapButtonAction}>
            <View style={styles.wrapButtonSelected}>
              <TouchableOpacity
                onPress={() =>
                  setToggleDropDownSelected(!toggleDropDownSelected)
                }
                activeOpacity={0.9}
                style={styles.wrapBtnSelect}>
                <Text
                  props={{
                    numberOfLines: 1,
                  }}
                  style={styles.labelSelect}>
                  {selectedDevice?.label}
                </Text>
                <MaterialCommunityIcons
                  style={styles.iconChervonRightSelect}
                  name="chevron-right"
                  size={sizes.SIZE_25}
                />
              </TouchableOpacity>
              <Suspense fallback={<></>}>
                {toggleDropDownSelected && selectedDevice && (
                  <DropdownSelected
                    selected={selectedDevice?.value}
                    containerStyle={styles.containerDropdownSelected}
                    data={deviceList}
                    onPressItem={item => handleSelectedDevice(item)}
                  />
                )}
              </Suspense>
            </View>
            {selectedDevice && (
              <TouchableHighlight
                underlayColor={
                  selectedDevice?.is_block
                    ? colors.COLOR_UNDERLAY_BLUE
                    : colors.COLOR_UNDERLAY_BUTTON_RED
                }
                activeOpacity={0.9}
                style={[
                  styles.btn,
                  selectedDevice?.is_block
                    ? {backgroundColor: colors.COLOR_BLUE}
                    : {},
                ]}
                onPress={() => {
                  if (selectedDevice) {
                    if (selectedDevice?.is_block) {
                      setVisibleDeviceUnLock(true);
                    } else {
                      setVisibleConfirmDeviceBlock(true);
                    }
                  } else {
                    flashMessage.error('Vui lòng chọn thiết bị');
                  }
                }}>
                <Text style={styles.btnLabel}>
                  {selectedDevice?.is_block ? 'Mở khoá' : 'Khoá thiết bị'}
                </Text>
              </TouchableHighlight>
            )}
          </View>
        )}
        {isLoading ? (
          <LoadingData />
        ) : isCheckMarker ? (
          <View style={styles.contentContainer}>
            <MapMarker
              refetching={isRefetching}
              timeUpdateLast={selectedDevice?.position_time}
              is_block={selectedDevice?.is_block}
              markers={markers}
              refresh_location={refresh}
            />
          </View>
        ) : (
          <EmptyData />
        )}
      </View>
    </Background>
  );
};

export default Location;
