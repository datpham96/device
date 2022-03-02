import React from 'react';
import {StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import metrics from 'metrics';
import {commonStyles, sizes, colors} from 'styles';

const ChildrenPlaceholder = () => {
  return (
    <SkeletonPlaceholder backgroundColor={colors.COLOR_LOADING_PLACEHOLDER}>
      <View style={[commonStyles.flexRowCenter, styles.container]}>
        <View style={styles.avatar} />
        <View style={styles.wrapInfo}>
          <View style={styles.name} />
          <View style={styles.device} />
          <View style={styles.status} />
          <View style={styles.date} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: sizes.SIZE_30,
  },
  avatar: {
    width: metrics.screenWidth / sizes.SIZE_5,
    height: metrics.screenWidth / sizes.SIZE_5,
    borderRadius: metrics.screenWidth / sizes.SIZE_10,
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
  device: {
    width: '80%',
    height: sizes.SIZE_15,
    borderRadius: sizes.SIZE_4,
    marginTop: sizes.SIZE_8,
  },
  status: {
    width: '50%',
    height: sizes.SIZE_15,
    borderRadius: sizes.SIZE_4,
    marginTop: sizes.SIZE_8,
  },
  date: {
    width: '60%',
    height: sizes.SIZE_15,
    borderRadius: sizes.SIZE_4,
    marginTop: sizes.SIZE_8,
  },
});

export default ChildrenPlaceholder;
