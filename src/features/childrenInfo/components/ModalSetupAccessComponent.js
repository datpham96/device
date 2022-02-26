import React, {useState, useEffect} from 'react';
import {Text} from 'base';
import {View, StyleSheet, TouchableOpacity, Modal, Alert} from 'react-native';
import images from 'images';
import FastImage from 'react-native-fast-image';
import {colors, commonStyles, fonts, sizes} from 'styles';
import metrics from 'metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Line} from 'components';
import SwitchComponent from './SwitchComponent';
import {PopupConfirm} from 'components';
import types from '../types';
import {useQuery, useMutation} from 'react-query';
import keyTypes from '../../../api/keyTypes';
import {deviceSettingListApi, deviceSettingUpdateApi} from 'methods/device';
import lodash from 'lodash';

const ModalSetupAccessComponent = ({
  visible = false,
  onPressClose,
  deviceId,
}) => {
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [enableSafeSearch, setEnableSafeSearch] = useState(false);
  const [enableSafeWeb, setEnableSafeWeb] = useState(false);
  const [settingType, setSettingType] = useState('');
  const {data: dataDeviceSettingList, refetch: refetch} = useQuery(
    keyTypes.DEVICE_SETTING_LIST + '_' + deviceId,
    () => deviceSettingListApi(deviceId),
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

  const onPressAgree = () => {
    setVisibleConfirm(false);
    let infoSafeWeb = lodash.find(dataDeviceSettingList.data, {
      name: types.safe_web.code,
    });
    let infoSafeSearch = lodash.find(dataDeviceSettingList.data, {
      name: types.safe_search.code,
    });
    let params = {};
    switch (settingType) {
      case types.safe_web.code:
        if (infoSafeWeb) {
          params.data_device_id = deviceId;
          params.data_setting_id = infoSafeWeb.id;
          params.data_name = types.safe_web.code;
          params.data_status = enableSafeWeb ? 1 : 0;
        } else {
          params.data_device_id = deviceId;
          params.data_name = types.safe_web.code;
          params.data_status = 1;
        }
        break;
      case types.safe_search.code:
        if (infoSafeSearch) {
          params.data_device_id = deviceId;
          params.data_setting_id = infoSafeSearch.id;
          params.data_name = types.safe_search.code;
          params.data_status = enableSafeSearch ? 1 : 0;
        } else {
          params.data_device_id = deviceId;
          params.data_name = types.safe_search.code;
          params.data_status = 1;
        }
        break;
    }

    mutationUpdate
      .mutateAsync(params)
      .then(resp => {
        if (resp?.status) {
          refetch();
          Alert.alert('Thông báo', 'Thiết lập thành công', [
            {
              text: 'Đóng',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ]);
        } else {
          Alert.alert('Thông báo', 'Thiết lập không thành công', [
            {
              text: 'Đóng',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ]);
        }
        mutationUpdate.reset();
      })
      .catch(() => {
        Alert.alert('Thông báo', 'Thiết lập không thành công', [
          {
            text: 'Đóng',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ]);
        mutationUpdate.reset();
      });
  };
  const onPressCancel = () => {
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

  // const handleSwitch = item => {
  //   setVisibleConfirm(true);
  //   setActiveItem(item);
  //   let deviceSettingIndex = lodash.findIndex(deviceSettingList, {id: item.id});
  //   deviceSettingList[deviceSettingIndex][item.id] =
  //     !deviceSettingList[deviceSettingIndex][item.id];
  //   setDeviceSettingList([...deviceSettingList]);
  // };

  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <PopupConfirm
        onPressAgree={onPressAgree}
        onPressCancel={onPressCancel}
        visible={visibleConfirm}
        content="Bạn có muốn thực hiện tác vụ này không?"
      />
      <View style={styles.backgroundModal} />
      <KeyboardAwareScrollView style={commonStyles.flex1}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.wrapIconClose}
              activeOpacity={0.8}
              onPress={onPressClose}>
              <FastImage style={styles.iconClose} source={images.icons.close} />
            </TouchableOpacity>
            <FastImage style={styles.image} source={images.logos.success} />
            <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
              Thiết lập quyền chặn
            </Text>
            <View style={styles.wrapRadio}>
              {/* {deviceSettingList.map((item, key) => {
                return (
                  <View key={key}>
                    <View style={styles.wrapSafeWeb}>
                      <View style={styles.headerSafeWeb}>
                        <FastImage
                          style={styles.iconInfo}
                          source={
                            item.name === types.safe_web.code
                              ? images.icons.safe_web
                              : images.icons.safe_search
                          }
                        />
                        <Text style={styles.labelInfo}>{item.description}</Text>
                        <SwitchComponent
                          value={item?.[item.id]}
                          onValueChange={() => setEnableSafeWeb(item)}
                          containerStyle={styles.switchSafeWeb}
                        />
                      </View>
                      <Text style={styles.contentSafeWeb}>{item.content}</Text>
                    </View>
                    <Line customStyle={styles.lineOne} />
                  </View>
                );
              })} */}
              <View style={styles.wrapSafeWeb}>
                <View style={styles.headerSafeWeb}>
                  <FastImage
                    style={styles.iconInfo}
                    source={images.icons.safe_web}
                  />
                  <Text style={styles.labelInfo}>Tìm kiếm an toàn</Text>
                  <SwitchComponent
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
                  Ngăn chặn quyền truy cập các website người lớn, bạo lực, cờ
                  bạc và lừa đảo. {'\n'}Bảo vệ quyền riêng tư khi lướt web và
                  lọc quảng cáo.
                </Text>
              </View>
              <Line customStyle={styles.lineOne} />
              <View style={styles.wrapSafeWeb}>
                <View style={styles.headerSafeWeb}>
                  <FastImage
                    style={styles.iconInfo}
                    source={images.icons.safe_search}
                  />
                  <Text style={styles.labelInfo}>Tìm kiếm an toàn</Text>
                  <SwitchComponent
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
                  Lọc bỏ kết quả tìm kiếm có chứa nội dung người lớn, bạo lực,
                  cờ bạc và lừa đảo.
                </Text>
              </View>
            </View>
            {/* <TouchableHighlight
              underlayColor={colors.COLOR_UNDERLAY_BUTTON_RED}
              activeOpacity={0.9}
              style={styles.btn}
              onPress={onPressSubmit}>
              <Text style={styles.btnLabel}>Đồng ý</Text>
            </TouchableHighlight> */}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...commonStyles.center,
  },
  backgroundModal: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    backgroundColor: colors.COLOR_BLACK,
    position: 'absolute',
    opacity: 0.5,
    zIndex: 0,
  },
  iconClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
  },
  image: {
    width: metrics.screenWidth / sizes.SIZE_6,
    height: metrics.screenWidth / sizes.SIZE_6,
    alignSelf: 'center',
    marginVertical: sizes.SIZE_30,
  },
  wrapIconClose: {
    alignSelf: 'flex-end',
  },
  container: {
    ...commonStyles.flex1,
    ...commonStyles.center,
    height: metrics.screenHeight,
  },
  contentContainer: {
    backgroundColor: colors.COLOR_DARK_BLUE,
    width: metrics.screenWidth - sizes.SIZE_30,
    borderRadius: sizes.SIZE_15,
    padding: sizes.SIZE_15,
    paddingBottom: sizes.SIZE_100,
  },
  mainTitle: {
    textAlign: 'center',
  },
  wrapRadio: {
    // flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: sizes.SIZE_10,
    marginTop: sizes.SIZE_30,
  },
  //content switch
  wrapInfo: {
    ...commonStyles.flexRowCenter,
  },
  iconInfo: {
    width: sizes.SIZE_40,
    height: sizes.SIZE_40,
  },
  labelInfo: {
    fontFamily: fonts.lexendDeca.FONT_MEDIUM,
    fontSize: sizes.SIZE_14,
    ...commonStyles.flex1,
    paddingHorizontal: sizes.SIZE_10,
  },
  lineOne: {
    marginVertical: sizes.SIZE_20,
  },
  wrapSafeWeb: {
    // ...commonStyles.flexRowCenter,
  },
  headerSafeWeb: {
    ...commonStyles.flexRowCenter,
  },
  switchSafeWeb: {
    alignSelf: 'center',
  },
  contentSafeWeb: {
    marginTop: sizes.SIZE_15,
    textAlign: 'justify',
    fontSize: sizes.SIZE_12,
    fontFamily: fonts.lexendDeca.FONT_LIGHT,
  },
  btn: {
    backgroundColor: colors.COLOR_RED_ORANGE,
    alignSelf: 'center',
    paddingHorizontal: sizes.SIZE_25,
    paddingVertical: sizes.SIZE_10,
    borderRadius: sizes.SIZE_25,
    marginTop: sizes.SIZE_50,
    width: sizes.SIZE_120,
  },
  btnLabel: {
    fontSize: sizes.SIZE_13,
    textAlign: 'center',
  },
});

export default ModalSetupAccessComponent;
