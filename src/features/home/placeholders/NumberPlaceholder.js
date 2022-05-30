import React from 'react';
import {StyleSheet, View} from 'react-native';
//node_modules
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
//api
//base
//components
//config
import {sizes, colors} from 'styles';
//helpers
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
//code-splitting
//screen

const NumberPlaceholder = ({customStyle}) => {
  return (
    <SkeletonPlaceholder backgroundColor={colors.COLOR_LOADING_PLACEHOLDER}>
      <View style={[styles.name, customStyle]} />
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
