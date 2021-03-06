import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
//node_modules
import {useMutation} from 'react-query';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
//api
import {webUpdateApi} from 'methods/web';
//base
import {Text, Avatar, Switch} from 'base';
//components
import {Loading, PopupConfirm} from 'components';
//config
import {colors, commonStyles, sizes} from 'styles';
//helpers
import {flashMessage} from 'helpers/funcs';
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
//code-splitting
//screen

momentDurationFormatSetup(moment);

const ItemComponent = ({item, onPressDetail, refreshList}) => {
  const mutation = useMutation(({data_web_id, data_status}) =>
    webUpdateApi(data_web_id, data_status),
  );

  const [enableSwitch, setEnablSwitch] = useState(item?.status ? true : false);
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
        data_web_id: item?.id,
        data_status: enableSwitch ? 1 : 0,
      })
      .then(resp => {
        if (resp?.status) {
          flashMessage.success(resp?.msg);
          refreshList();
        } else {
          flashMessage.error(resp?.msg);
        }
        mutation.reset();
      })
      .catch(err => {
        flashMessage.error(err?.msg);
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
      <Loading isLoading={mutation?.isLoading} />
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
        onLongPress={() => handleShowDetail(item?.url)}
        style={styles.wrapItemWebsite}>
        <Avatar
          isWeb
          uriImage={item?.icon}
          containerStyle={styles.imageContainer}
          imageStyle={styles.image}
        />
        <View style={styles.wrapInfo}>
          <Text
            props={{
              numberOfLines: 1,
            }}
            style={styles.name}>
            {item?.name}
          </Text>
          <Text
            props={{
              numberOfLines: 1,
            }}
            style={styles.domain}>
            {item?.url}
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
