import React, {useState, useMemo, useEffect} from 'react';
import {Text, Background} from 'base';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import styles from './styles';
import {commonStyles, colors, sizes} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {
  InputSelectComponent,
  Line,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SwitchComponent} from '../components';
import types from '../types';
import * as RootNavigation from 'RootNavigation';

const Setting = ({}) => {
  const [enableSafeWeb, setEnableSafeWeb] = useState(false);
  const [enableSafeSearch, setEnableSafeSearch] = useState(false);
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [type, setType] = useState('');

  const handleRequest = () => {
    if (types.safe_web.code === type) {
      console.log('web');
    } else {
      console.log('search');
    }
    setVisibleConfirmModal(false);
  };

  const handleCancelRequest = () => {
    if (types.safe_web.code === type) {
      setEnableSafeWeb(false);
    } else {
      setEnableSafeSearch(false);
    }
    setVisibleConfirmModal(false);
  };

  const handleRedirectAccount = () => {
    RootNavigation.navigate(navigationTypes.account.screen);
  };

  return (
    <Background bottomTab bout>
      <PopupConfirm
        onPressAgree={handleRequest}
        onPressCancel={() => handleCancelRequest()}
        visible={visibleConfirmModal}
        content="Bạn có muốn thực hiện tác vụ này không?"
      />
      <View style={styles.container}>
        <Text style={commonStyles.mainTitle}>Cài đặt</Text>
        <ScrollView style={styles.wrapContent}>
          <TouchableOpacity
            onPress={handleRedirectAccount}
            activeOpacity={0.9}
            style={styles.wrapInfo}>
            <FastImage
              style={styles.iconInfo}
              source={images.icons.info_manager}
            />
            <Text style={styles.labelInfo}>Quản lý thông tin</Text>
            <MaterialCommunityIcons
              style={styles.iconChevronRight}
              name="chevron-right"
              size={sizes.SIZE_30}
              color={colors.COLOR_WHITE}
            />
          </TouchableOpacity>
          <Line customStyle={styles.lineOne} />
          <View style={styles.wrapSafeWeb}>
            <View style={styles.headerSafeWeb}>
              <FastImage
                style={styles.iconInfo}
                source={images.icons.safe_web}
              />
              <Text style={styles.labelInfo}>Lướt web an toàn</Text>
              <SwitchComponent
                value={enableSafeWeb}
                onValueChange={() => {
                  setVisibleConfirmModal(true);
                  setType(types.safe_web.code);
                  setEnableSafeWeb(!enableSafeWeb);
                }}
                containerStyle={styles.switchSafeWeb}
              />
            </View>
            <Text style={styles.contentSafeWeb}>
              SafeZone sẽ kiểm tra nếu tên miền chứa từ khóa người lớn. Tính
              năng sử dụng với quyền riêng tư tương tự với dịch vụ bảo vệ duyệt
              web.
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
                  setVisibleConfirmModal(true);
                  setType(types.safe_search.code);
                  setEnableSafeSearch(!enableSafeSearch);
                }}
                containerStyle={styles.switchSafeWeb}
              />
            </View>
            <Text style={styles.contentSafeWeb}>
              SafeZone có thể bắt buộc tìm kiếm an toàn với các công cụ tìm
              kiếm: Google, Youtube, Bing,...
            </Text>
          </View>
        </ScrollView>
      </View>
    </Background>
  );
};

export default Setting;
