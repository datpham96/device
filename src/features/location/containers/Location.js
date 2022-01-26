import React, {useState, useMemo} from 'react';
import {Text, Background} from 'base';
import {View, TouchableOpacity, TouchableHighlight} from 'react-native';
import styles from './styles';
import {commonStyles, colors, sizes} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {InputSelectComponent, Loading, PopupConfirm} from 'components';
import keyTypes from 'keyTypes';
import {deviceListApi, deviceUpdateApi} from 'methods/device';
import {useQuery, useMutation} from 'react-query';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {Toast} from 'customs';
// import DropDownPicker from 'react-native-dropdown-picker';

const region = {
  latitude: 21.030653,
  longitude: 105.84713,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

const Location = ({}) => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [markers, serMarkers] = useState({});
  const [visibleConfirmDeviceBlock, setVisibleConfirmDeviceBlock] =
    useState(false);

  const {data, isSuccess} = useQuery(
    keyTypes.DEVICE_LIST,
    () => deviceListApi(),
    {
      keepPreviousData: true,
    },
  );

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
    serMarkers({
      coordinate: e.nativeEvent.coordinate,
      key: 1,
    });
  };

  const handleDeviceLock = () => {
    setVisibleConfirmDeviceBlock(false);
    if (!selectedDevice) {
      Toast('Vui lòng chọn thiết bị');
      return;
    }

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
      <PopupConfirm
        visible={visibleConfirmDeviceBlock}
        content="Bạn có chắc chắn muốn khoá thiết bị này không"
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
            onPress={() => console.log(1111)}>
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
            region={region}
            onPress={handleMaker}>
            <Marker
              // image={{
              //   uri: 'https://raw.githubusercontent.com/react-native-maps/react-native-maps/master/example/examples/assets/flag-pink.png',
              // }}
              image={images.icons.bt_location}
              pinColor={colors.COLOR_RED_ORANGE}
              coordinate={region}
              tappable={false}
            />
          </MapView>
        </View>
      </View>
    </Background>
  );
};

export default Location;
