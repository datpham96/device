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
          <View>
            <View style={styles.name} />
            <View style={styles.domain} />
          </View>
          <View style={styles.time} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: sizes.SIZE_10,
  },
  avatar: {
    width: metrics.screenWidth / sizes.SIZE_8,
    height: metrics.screenWidth / sizes.SIZE_8,
    borderRadius: metrics.screenWidth / sizes.SIZE_16,
  },
  wrapInfo: {
    marginLeft: sizes.SIZE_15,
    ...commonStyles.flex1,
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
  },
  name: {
    width: metrics.screenWidth / sizes.SIZE_2,
    height: sizes.SIZE_15,
    borderRadius: sizes.SIZE_4,
  },
  domain: {
    width: metrics.screenWidth / sizes.SIZE_3,
    height: sizes.SIZE_15,
    borderRadius: sizes.SIZE_4,
    marginTop: sizes.SIZE_5,
  },
  time: {
    width: metrics.screenWidth / sizes.SIZE_8,
    height: sizes.SIZE_15,
    borderRadius: sizes.SIZE_4,
  },
});

export default ItemListPlaceholder;
