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

const ItemListPlaceholder = () => {
  return (
    <SkeletonPlaceholder backgroundColor={colors.COLOR_LOADING_PLACEHOLDER}>
      <View style={[commonStyles.flexRowCenter, styles.container]}>
        <View style={styles.avatar} />
        <View style={styles.wrapInfo}>
          <View style={styles.name} />
          <View style={styles.doman} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {},
  avatar: {
    width: metrics.screenWidth / sizes.SIZE_7,
    height: metrics.screenWidth / sizes.SIZE_7,
    borderRadius: metrics.screenWidth / sizes.SIZE_14,
  },
  wrapInfo: {
    marginLeft: sizes.SIZE_15,
    ...commonStyles.flex1,
  },
  name: {
    width: '100%',
    height: sizes.SIZE_15,
    borderRadius: sizes.SIZE_4,
  },
  doman: {
    width: '80%',
    height: sizes.SIZE_15,
    borderRadius: sizes.SIZE_4,
    marginTop: sizes.SIZE_8,
  },
});

export default ItemListPlaceholder;
