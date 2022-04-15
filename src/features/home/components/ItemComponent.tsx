import React from 'react';
import {View, StyleSheet, Alert, TouchableOpacity, Linking} from 'react-native';
import {Avatar, Text} from 'base';
import {commonStyles, fonts, sizes} from 'styles';
import metrics from 'metrics';
import {checkVar} from 'src/helpers/funcs';

export type Props = {
  item?: any;
};

const ItemComponent: React.FC<Props> = ({item}) => {
  const handleShowDetail = (url: any) => {
    Alert.alert('Thông tin', url, [
      {
        text: 'Đóng',
        style: 'cancel',
      },
      {
        text: 'Truy cập',
        onPress: () => Linking.openURL(url),
      },
    ]);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={() => handleShowDetail(item?.url)}
      style={styles.container}>
      <Avatar
        isWeb
        imageStyle={styles.image}
        uriImage={item?.icon}
        containerStyle={styles.image}
      />
      <View style={styles.info}>
        {!checkVar.isEmpty(item?.name) && (
          <Text
            props={{
              numberOfLines: 1,
            }}
            style={styles.label}>
            {item?.name}
          </Text>
        )}
        <Text
          props={{
            numberOfLines: 1,
          }}
          style={styles.domain}>
          {item?.domain}
        </Text>
      </View>
      <Text style={styles.total}>{item?.total}</Text>
      <Text style={styles.status}>
        {item?.status === 0 ? 'Đã chặn' : 'Cho phép'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flexRowCenter,
    marginBottom: sizes.SIZE_20,
  },
  image: {
    width: metrics.screenWidth / sizes.SIZE_7,
    height: metrics.screenWidth / sizes.SIZE_7,
  },
  info: {
    justifyContent: 'center',
    marginLeft: sizes.SIZE_15,
    ...commonStyles.flex1,
    paddingRight: sizes.SIZE_10,
  },
  label: {
    fontSize: sizes.SIZE_16,
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    marginBottom: sizes.SIZE_5,
  },
  domain: {
    fontSize: sizes.SIZE_14,
    fontFamily: fonts.lexendDeca.FONT_EXTRA_LIGHT,
  },
  total: {
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    width: sizes.SIZE_80,
    textAlign: 'center',
  },
  status: {
    width: sizes.SIZE_80,
    textAlign: 'right',
  },
});

export default ItemComponent;
