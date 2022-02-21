import React, {useState, useMemo, useEffect} from 'react';
import {Text, Background} from 'base';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert,
  Platform,
  AppState,
} from 'react-native';
import styles from './styles';
import {commonStyles, colors} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {
  InputSelectComponent,
  Loading,
  PopupAlert,
  PopupConfirm,
} from 'components';
import keyTypes from 'keyTypes';
import {deviceListApi, deviceUpdateApi} from 'methods/device';
import {useQuery, useMutation} from 'react-query';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {Toast} from 'customs';
import lodash from 'lodash';
import {checkVar} from 'src/helpers/funcs';
// import DropDownPicker from 'react-native-dropdown-picker';
import {
  requestMultiple,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import navigationTypes from 'navigationTypes';
import Geocoder from 'react-native-geocoder';
// simply add your google key
Geocoder.fallbackToGoogle(
  // Platform.OS === 'ios'
  //   ? 'AIzaSyDGFfixmp8tujwil1iyJjN7tEZP3Ho7hVU'
  //   : 'AIzaSyB5yQcadhAvM58X9C-3YrzyKtJGo5YyOeo',
  'AIzaSyDGFfixmp8tujwil1iyJjN7tEZP3Ho7hVU',
);

const Location = ({navigation, route}) => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [refresh, setRefresh] = useState(false);
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

  const {data, isSuccess} = useQuery(
    keyTypes.DEVICE_LIST,
    () => deviceListApi(),
    {
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      requestMultiple([
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ]).then(result => {
        if (
          (result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.BLOCKED &&
            result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.BLOCKED) ||
          (result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.DENIED &&
            result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.DENIED)
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
          result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED
        ) {
          setRefresh(!refresh);
        }
      });
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, refresh]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', status => {
      if (Platform.OS === 'ios' && status === 'active') {
        requestMultiple([
          PERMISSIONS.IOS.LOCATION_ALWAYS,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]).then(result => {
          if (
            (result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.BLOCKED &&
              result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                RESULTS.BLOCKED) ||
            (result[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.DENIED &&
              result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.DENIED)
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
            result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED
          ) {
            setRefresh(!refresh);
          }
        });
      }
    });

    return listener.remove;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedDevice && data?.data) {
      let deviceInfo = lodash.find(data.data, {id: selectedDevice});
      if (
        deviceInfo &&
        !checkVar.isEmpty(deviceInfo?.latitude) &&
        !checkVar.isEmpty(deviceInfo?.longitude)
      ) {
        Geocoder.geocodePosition({
          lat: parseFloat(deviceInfo.latitude),
          lng: parseFloat(deviceInfo.longitude),
        })
          .then(resp => {
            if (resp && resp[0]) {
              serMarkers({
                latitude: parseFloat(deviceInfo.latitude),
                longitude: parseFloat(deviceInfo.longitude),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
                avatar: deviceInfo.avatar,
                address: resp[0]?.formattedAddress,
              });
            }
          })
          .catch(err => {
            console.log(err, 'err');
          });
      } else {
        Alert.alert('Thông báo', 'Không tìm thấy vị trí trên bản đồ', [
          {
            text: 'Đóng',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ]);
        serMarkers({
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
      }
    }
  }, [selectedDevice, data, refresh]);

  const mutationDeviceLock = useMutation(
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

  const deviceList = useMemo(() => {
    let tmpSelectList = [];
    if (isSuccess && data?.data) {
      data.data.map(item => {
        tmpSelectList.push({
          label: item.full_name,
          value: item.id,
        });
      });
    }
    return tmpSelectList;
  }, [data, isSuccess]);

  const handleMaker = e => {
    // serMarkers({
    //   coordinate: e.nativeEvent.coordinate,
    //   key: 1,
    // });
  };

  const handleSetting = () => {
    setVisiblePermissionLocation(false);
    openSettings().catch(() => console.warn('cannot open settings'));
  };

  const handleDeviceLock = () => {
    if (!selectedDevice) {
      Toast('Vui lòng chọn thiết bị');
      return;
    }
    setVisibleConfirmDeviceBlock(false);

    mutationDeviceLock
      .mutateAsync({
        data_device_id: selectedDevice,
        data_is_block: 1,
        data_full_name: null,
        data_birthday: null,
        data_gender: null,
      })
      .then(resp => {
        if (resp?.status) {
          Toast('Khoá thiết bị thành công');
        } else {
          Toast(resp?.msg);
        }
        mutationDeviceLock.reset();
      })
      .catch(err => {
        Toast(err?.msg);
        mutationDeviceLock.reset();
      });
  };

  return (
    <Background bottomTab bout>
      <Loading isLoading={mutationDeviceLock.isLoading} />
      {/* <PopupAlertDeviceLock
        visible={true}
        content="Bạn có chắc chắn muốn khoá thiết bị này không"
        onPressCancel={() => setVisibleConfirmDeviceBlock(false)}
        onPressAgree={handleDeviceLock}
      /> */}
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
      <PopupConfirm
        visible={visibleConfirmDeviceBlock}
        content="Bạn có chắc chắn muốn khoá thiết bị này không?"
        onPressCancel={() => setVisibleConfirmDeviceBlock(false)}
        onPressAgree={handleDeviceLock}
      />
      {/* <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        showTickIcon={false}
        containerStyle={{width: 100}}
        style={{borderRadius: 30, height: 44}}
        closeOnBackPressed={false}
      /> */}
      <View style={styles.container}>
        <View style={styles.wrapMainTitle}>
          <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
            Định vị thiết bị
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setRefresh(!refresh)}>
            <FastImage
              source={images.icons.refresh}
              style={styles.iconRefresh}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.wrapButtonAction}>
          <View style={styles.wrapBtnSelect}>
            <InputSelectComponent
              onDonePress={val => setSelectedDevice(val)}
              placeholder="--Chọn--"
              listData={deviceList}
            />
          </View>
          <TouchableHighlight
            underlayColor={colors.COLOR_UNDERLAY_BUTTON_RED}
            activeOpacity={0.9}
            style={styles.btn}
            onPress={() => {
              if (selectedDevice) {
                setVisibleConfirmDeviceBlock(true);
              } else {
                Toast('Vui lòng chọn thiết bị');
              }
            }}>
            <Text style={styles.btnLabel}>Khoá thiết bị</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.contentContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={markers}
            onPress={handleMaker}>
            <Marker
              pinColor={colors.COLOR_RED_ORANGE}
              coordinate={markers}
              tappable={false}>
              {markers?.latitude > 0 && markers?.longitude > 0 && (
                <>
                  {markers?.address && (
                    <View style={styles.wrapLabelLocation}>
                      <Text style={styles.labelLocation}>
                        {markers?.address}
                      </Text>
                    </View>
                  )}
                  <View style={styles.wrapImageMarkers}>
                    <Image
                      style={styles.imageMarker}
                      source={
                        markers?.avatar
                          ? {uri: markers.avatar}
                          : images.avatars.default
                      }
                    />
                    <View style={styles.triangleMarker} />
                  </View>
                </>
              )}
            </Marker>
          </MapView>
        </View>
      </View>
    </Background>
  );
};

export default Location;
