import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Avatar} from 'base';
import {commonStyles, sizes} from 'styles';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';

export type Props = {
  item?: any;
};

const ItemChildrenComponent: React.FC<Props> = ({item}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() =>
        RootNavigation.navigate(navigationTypes.childrenInfo.screen, {
          device_id: item.id,
        })
      }>
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
