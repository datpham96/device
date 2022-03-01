import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, Linking} from 'react-native';
import {Text, Avatar, Switch} from 'base';
import {colors, commonStyles, sizes} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {useMutation} from 'react-query';
import {webUpdateApi} from 'src/api/methods/web';
import {Loading, PopupConfirm} from 'components';
import {Toast} from 'customs';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import {ItemListPlaceholder} from '../placeholders';

momentDurationFormatSetup(moment);

const ItemComponent = ({item, onPressDetail}) => {
  const timeUse = moment(item.time_remaining, 'YYYY-MM-DD HH:mm:ss').diff(
    moment(),
    'minutes',
  );
  let duration = '00:00';
  if (timeUse && timeUse > 0) {
    if (timeUse > 60) {
      duration = moment.duration(timeUse, 'minutes').format('HH:mm');
    } else {
      duration = moment.duration(timeUse, 'minutes').format('00:mm');
    }
  }
  const mutation = useMutation(
    ({data_web_id, data_status, data_time_remaining}) =>
      webUpdateApi(data_web_id, data_status, data_time_remaining),
  );

  const [enableSwitch, setEnablSwitch] = useState(item.status ? true : false);
  const [visibleModal, setVisibleModal] = useState(false);

  const handleToggleSwitch = () => {
    let tmpEnableSwitch = enableSwitch;
    setEnablSwitch(!tmpEnableSwitch);
    setVisibleModal(true);
  };

  const handleAgreeUpdate = () => {
    setVisibleModal(false);
    mutation
      .mutateAsync({
        data_web_id: item.id,
        data_status: enableSwitch ? 1 : 0,
        data_time_remaining: 0,
      })
      .then(resp => {
        if (resp.status) {
          Toast(resp.msg);
        } else {
          Toast(resp.msg);
        }
        mutation.reset();
      })
      .catch(err => {
        Toast(err?.msg);
        setVisibleModal(false);
        mutation.reset();
      });
  };

  const handleShowDetail = url => {
    Alert.alert('Thông tin', url, [
      {
        text: 'Đóng',
        style: 'cancel',
      },
      // {
      //   text: 'Truy cập',
      //   onPress: () => Linking.openURL(url),
      // },
    ]);
  };

  return (
    <View style={styles.container}>
      <Loading isLoading={mutation.isLoading} />
      <PopupConfirm
        visible={visibleModal}
        onPressAgree={() => handleAgreeUpdate()}
        onPressCancel={() => {
          setVisibleModal(false);
          setEnablSwitch(!enableSwitch);
        }}
        content="Bạn có chắc chắn muốn thay đổi trạng thái website này không?"
      />
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={() => handleShowDetail(item.url)}
        style={styles.wrapItemWebsite}>
        <Avatar
          isWeb
          uriImage={item.icon}
          containerStyle={styles.imageContainer}
          imageStyle={styles.image}
        />
        <View style={styles.wrapInfo}>
          <Text
            props={{
              numberOfLines: 1,
            }}
            style={styles.name}>
            {item.name}
          </Text>
          <Text
            props={{
              numberOfLines: 1,
            }}
            style={styles.domain}>
            {item.url}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.wrapUse}
        onPress={() => onPressDetail({...item, status: enableSwitch})}>
        <Text>Xem chi tiết</Text>
      </TouchableOpacity>
      <View style={styles.wrapRadio}>
        <Switch
          value={enableSwitch}
          onValueChange={handleToggleSwitch}
          containerStyle={styles.switchConatiner}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.SIZE_15,
  },
  wrapItemWebsite: {
    flexDirection: 'row',
    alignItems: 'center',
    ...commonStyles.flex1,
    marginRight: sizes.SIZE_10,
  },
  imageContainer: {
    width: sizes.SIZE_50,
    height: sizes.SIZE_50,
  },
  image: {
    width: sizes.SIZE_50,
    height: sizes.SIZE_50,
  },
  wrapInfo: {
    marginLeft: sizes.SIZE_10,
    flex: 1,
  },
  name: {
    // fontSize: sizes.SIZE_10,
  },
  domain: {
    fontSize: sizes.SIZE_13,
    marginTop: sizes.SIZE_3,
  },
  wrapUse: {
    ...commonStyles.flexRowCenter,
    width: sizes.SIZE_100,
  },
  wrapTime: {
    backgroundColor: colors.COLOR_WHITE,
    paddingHorizontal: sizes.SIZE_10,
    paddingVertical: sizes.SIZE_5,
    borderRadius: sizes.SIZE_15,
    ...commonStyles.flexRowCenter,
  },
  timeValue: {
    color: colors.COLOR_BLACK,
    fontSize: sizes.SIZE_13,
  },
  iconTime: {
    width: sizes.SIZE_15,
    height: sizes.SIZE_15,
    marginLeft: sizes.SIZE_5,
  },
  iconClose: {
    width: sizes.SIZE_25,
    height: sizes.SIZE_25,
    marginLeft: sizes.SIZE_5,
  },
  wrapRadio: {
    width: sizes.SIZE_100,
    ...commonStyles.center,
  },
  switchConatiner: {
    alignSelf: 'flex-end',
  },
});

export default ItemComponent;
