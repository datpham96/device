import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
//node_modules
import moment from 'moment';
//api
//base
import {Text, Avatar} from 'base';
//components
//config
import {colors, commonStyles, sizes} from 'styles';
//helpers
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
//code-splitting
//screen
export type Props = {
  item?: any;
  onPress?: any;
};

const ItemChildrenComponent: React.FC<Props> = ({item, onPress}) => {
  const formatExpiredDate = (date: any) => {
    let obj = {
      expired: false,
      date: '',
    };
    try {
      if (moment().isAfter(moment(date, 'YYYY-MM-DD HH:mm:ss'), 'days')) {
        obj.date = 'Đã hết hạn';
        obj.expired = true;
      } else {
        obj.date = moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
        obj.expired = false;
      }
    } catch (error) {}

    return obj;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={onPress}>
      <Avatar uriImage={item?.avatar} />
      <View style={styles.wrapInfo}>
        <Text style={styles.singleInfo}>{item?.full_name}</Text>
        <Text style={styles.singleInfo}>{item?.device_name}</Text>
        {!formatExpiredDate(item?.expire_time)?.expired ? (
          <Text style={styles.singleInfo}>
            {item.status ? 'Đã kết nối' : 'Chưa kết nối'}
          </Text>
        ) : (
          <Text style={styles.singleInfo}>
            <Text style={styles.expiredLabel}>Đã hết hạn</Text>
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.SIZE_20,
  },
  wrapInfo: {
    marginLeft: sizes.SIZE_15,
    ...commonStyles.flex1,
  },
  singleInfo: {
    marginBottom: sizes.SIZE_5,
    fontSize: sizes.SIZE_16,
  },
  expiredLabel: {
    color: colors.COLOR_ERROR,
  },
});

export default ItemChildrenComponent;
