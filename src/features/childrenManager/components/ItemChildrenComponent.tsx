import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Avatar} from 'base';
import {commonStyles, sizes} from 'styles';

export type Props = {
  item?: any;
  onPress?: any;
};

const ItemChildrenComponent: React.FC<Props> = ({item, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={onPress}>
      <Avatar uriImage={item.avatar} />
      <View style={styles.wrapInfo}>
        <Text style={styles.singleInfo}>{item.full_name}</Text>
        <Text style={styles.singleInfo}>{item.device_name}</Text>
        <Text style={styles.singleInfo}>
          {item.status ? 'Đã kết nối' : 'Chưa kết nối'}
        </Text>
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
});

export default ItemChildrenComponent;
