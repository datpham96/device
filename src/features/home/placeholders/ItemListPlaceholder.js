import React from 'react';
import {StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import metrics from 'metrics';
import {commonStyles, sizes, colors} from 'styles';

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
