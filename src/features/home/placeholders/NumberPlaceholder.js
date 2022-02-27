import React from 'react';
import {StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import {sizes, colors} from 'styles';

const NumberPlaceholder = () => {
  return (
    <SkeletonPlaceholder backgroundColor={colors.COLOR_LOADING_PLACEHOLDER}>
      <View style={styles.name} />
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  name: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_13,
    borderRadius: sizes.SIZE_4,
  },
});

export default NumberPlaceholder;
