import React, {useState, useMemo, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {DevicePlaceholder} from '../placeholders';
import {DropdownSelected} from 'components';
import lodash from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {sizes, colors, commonStyles, fonts} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {checkVar, truncateWords} from 'src/helpers/funcs';
import {Text} from 'base';
import metrics from 'metrics';

const DeviceSelectComponent = ({
  onSelectedDevice,
  selectedDevice,
  dataDeviceList,
  isLoadingDeviceList,
  isSuccessDeviceList,
}) => {
  const [toggleDeviceSelected, setToggleDeviceSelected] = useState(false);

  useEffect(() => {
    if (isSuccessDeviceList && dataDeviceList?.data) {
      if (checkVar.isEmpty(selectedDevice)) {
        onSelectedDevice(dataDeviceList?.data[0]);
      } else {
        let infoSelected = lodash.find(dataDeviceList?.data, {
          id: selectedDevice.id,
        });
        onSelectedDevice(infoSelected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDeviceList, isSuccessDeviceList, selectedDevice]);

  //format device list
  const deviceList = useMemo(() => {
    let tmpDataList = [];
    if (isSuccessDeviceList && dataDeviceList?.data) {
      dataDeviceList?.data?.map(item => {
        tmpDataList.push({
          label: item.full_name,
          value: item.id,
        });
      });
    }

    return tmpDataList;
  }, [isSuccessDeviceList, dataDeviceList]);

  const handleSelectedDevice = val => {
    onSelectedDevice(val);
  };

  const handleActiveItemDevice = item => {
    if (dataDeviceList && dataDeviceList?.data) {
      let info = lodash.find(dataDeviceList?.data, {id: item.value});
      handleSelectedDevice(info);
      setToggleDeviceSelected(false);
    }
  };

  const handleShowDeviceSelect = () => {
    setToggleDeviceSelected(!toggleDeviceSelected);
  };
  return (
    <View>
      {isLoadingDeviceList ? (
        <DevicePlaceholder />
      ) : (
        <View style={styles.selectedContainer}>
          <TouchableOpacity
            style={styles.wrapSelected}
            activeOpacity={0.9}
            onPress={handleShowDeviceSelect}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={sizes.SIZE_20}
              color={colors.COLOR_WHITE}
              style={styles.iconChevronLeft}
            />
            <View style={styles.wrapAvatarDevice}>
              <FastImage
                source={
                  selectedDevice?.is_block === 0
                    ? selectedDevice?.avatar
                      ? {uri: selectedDevice?.avatar}
                      : images.avatars.default
                    : images.avatars.shield
                }
                style={styles.avatarShield}
                resizeMode={FastImage.resizeMode.cover}
              />
              {selectedDevice && selectedDevice?.is_online === 1 && (
                <View style={styles.dotOnline} />
              )}
              {selectedDevice && selectedDevice?.is_online !== 1 && (
                <View style={styles.dotOffline} />
              )}
            </View>
            <Text style={styles.titleShield}>
              {truncateWords(selectedDevice?.full_name, sizes.SIZE_2, '...')}
            </Text>
          </TouchableOpacity>
          {toggleDeviceSelected && (
            <DropdownSelected
              onPressItem={item => handleActiveItemDevice(item)}
              containerStyle={styles.scrollItemDeviceSelect}
              data={deviceList}
              selected={selectedDevice?.id}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedContainer: {
    width: metrics.screenWidth / sizes.SIZE_3,
  },
  wrapSelected: {
    ...commonStyles.flexRowCenter,
  },
  iconChevronLeft: {},
  avatarShield: {
    width: metrics.screenWidth / sizes.SIZE_10,
    height: metrics.screenWidth / sizes.SIZE_10,
    borderRadius: metrics.screenWidth / sizes.SIZE_10 / sizes.SIZE_2,
    borderWidth: sizes.SIZE_1,
    borderColor: colors.COLOR_WHITE,
  },
  wrapAvatarDevice: {
    position: 'relative',
  },
  dotOnline: {
    width: sizes.SIZE_10,
    height: sizes.SIZE_10,
    backgroundColor: colors.COLOR_GREEN,
    borderRadius: sizes.SIZE_5,
    position: 'absolute',
  },
  dotOffline: {
    width: sizes.SIZE_10,
    height: sizes.SIZE_10,
    backgroundColor: colors.COLOR_RED_ORANGE,
    borderRadius: sizes.SIZE_5,
    position: 'absolute',
  },
  titleShield: {
    marginLeft: sizes.SIZE_8,
    ...commonStyles.flex1,

    // width: sizes.SIZE_80,
  },
  scrollItemDeviceSelect: {
    // top: metrics.screenWidth / sizes.SIZE_10 + sizes.SIZE_5,
    width: '120%',
  },
  contentItemDeviceSelect: {
    paddingBottom: sizes.SIZE_15,
  },
  wrapItemDeviceSelect: {
    ...commonStyles.flexRowCenter,
  },
  itemDeviceSelect: {
    color: colors.COLOR_BLACK,
    marginLeft: sizes.SIZE_5,
    fontFamily: fonts.montserrat.FONT_REGULAR,
    lineHeight: sizes.SIZE_25,
  },
  circleItemSelected: {
    width: sizes.SIZE_10,
    height: sizes.SIZE_10,
    borderRadius: sizes.SIZE_5,
    borderWidth: sizes.SIZE_1,
    borderColor: colors.COLOR_BLACK,
  },
});

export default DeviceSelectComponent;
