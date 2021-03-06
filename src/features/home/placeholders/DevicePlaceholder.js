import React from 'react';
import {StyleSheet, View} from 'react-native';
//node_modules
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
//api
//base
//components
//config
import metrics from 'metrics';
import {commonStyles, sizes, colors} from 'styles';
//helpers
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
//code-splitting
//screen

const ItemDevicePlaceholder = () => {
  return (
    <SkeletonPlaceholder backgroundColor={colors.COLOR_LOADING_PLACEHOLDER}>
      <View style={[commonStyles.flexRowCenter, styles.container]}>
        <View style={styles.avatar} />
        <View style={styles.wrapInfo}>
          <View style={styles.name} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    width: metrics.screenWidth / 3.5,
  },
  avatar: {
    width: metrics.screenWidth / sizes.SIZE_10,
    height: metrics.screenWidth / sizes.SIZE_10,
    borderRadius: metrics.screenWidth / sizes.SIZE_14,
  },
  wrapInfo: {
    marginLeft: sizes.SIZE_10,
    ...commonStyles.flex1,
  },
  name: {
    height: sizes.SIZE_15,
    borderRadius: sizes.SIZE_4,
  },
});

export default ItemDevicePlaceholder;
