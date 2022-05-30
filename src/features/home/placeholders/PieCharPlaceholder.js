import React from 'react';
import {View, StyleSheet} from 'react-native';
//node_modules
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
//api
//base
import {Text} from 'base';
//components
//config
import {colors, commonStyles, fonts, sizes} from 'styles';
import metrics from 'metrics';
//helpers
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
//code-splitting
//screen
const widthChart = metrics.screenWidth / 2.2;

const PieCharPlaceholder = () => {
  return (
    <View style={styles.circleContainer}>
      <SkeletonPlaceholder backgroundColor={colors.COLOR_LOADING_PLACEHOLDER}>
        <View style={styles.circle} />
      </SkeletonPlaceholder>
      <View style={styles.inCircle} />
      <Text style={styles.percent}>0%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    ...commonStyles.center,
  },
  circle: {
    width: widthChart,
    height: widthChart,
    borderRadius: widthChart / sizes.SIZE_2,
  },
  inCircle: {
    width: widthChart / sizes.SIZE_2,
    height: widthChart / sizes.SIZE_2,
    borderRadius: widthChart / sizes.SIZE_4,
    backgroundColor: colors.COLOR_UNDERLAY_BUTTON_BLACK,
    position: 'absolute',
  },
  percent: {
    fontSize: sizes.SIZE_20,
    position: 'absolute',
    fontFamily: fonts.lexendDeca.FONT_BOLD,
  },
});

export default PieCharPlaceholder;
