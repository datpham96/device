import React, {useState, useMemo} from 'react';
import {Text, Background} from 'base';
import {View, TouchableOpacity, TouchableHighlight} from 'react-native';
import styles from './styles';
import {commonStyles, colors, sizes} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {InputSelectComponent} from 'components';
import keyTypes from 'keyTypes';
import {deviceListApi} from 'methods/device';
import {useQuery, useQueryClient} from 'react-query';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
// import DropDownPicker from 'react-native-dropdown-picker';

const region = {
  latitude: 21.030653,
  longitude: 105.84713,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

const Location = ({}) => {
  const queryClient = useQueryClient();
  const [selectedDevice, setSelectedDevice] = useState('');
  const [markers, serMarkers] = useState({});

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);

  const {data, isSuccess} = useQuery(
    keyTypes.DEVICE_LIST,
    () => deviceListApi(),
    {
      keepPreviousData: true,
    },
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

  return (
    <Background bottomTab bout>
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
            onPress={() => console.log(11111)}>
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
