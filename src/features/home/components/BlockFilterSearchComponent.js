import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'base';
import {AreaChart} from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {colors, commonStyles, fonts, sizes} from 'styles';
import FastImage from 'react-native-fast-image';
import metrics from 'metrics';
import {landmarkUnitOfNumber} from 'src/helpers/funcs';
import lodash from 'lodash';

const BlockFilterSearchComponent = ({
  data = [],
  iconImage,
  title,
  total,
  svgFillColor,
}) => {
  const maxNumber = lodash.max(data);
  const unitNumber = landmarkUnitOfNumber(maxNumber);
  return (
    <View style={styles.container}>
      <>
        <AreaChart
          style={styles.areaChart}
          data={data?.map(val => {
            return unitNumber > 0 ? Math.ceil(val / unitNumber) * 1.5 : 0;
          })}
          contentInset={{top: sizes.SIZE_5, bottom: sizes.ZERO}}
          curve={shape.curveNatural}
          svg={{fill: colors.COLOR_WHITE}}
          animate={true}
          xMin={0}
          yMin={0}
          animationDuration={500}
        />
        <AreaChart
          style={styles.areaChart}
          data={data?.map(val => {
            return unitNumber > 0 ? Math.ceil(val / unitNumber) : 0;
          })}
          contentInset={{top: sizes.SIZE_15, bottom: sizes.ZERO}}
          curve={shape.curveNatural}
          svg={{fill: svgFillColor}}
          animate={true}
          xMin={0}
          yMin={0}
          animationDuration={500}
        />
      </>
      <View style={styles.contentContainer}>
        <View style={styles.wrapInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.total}>{total}</Text>
        </View>
        <FastImage
          style={styles.iconTotal}
          source={iconImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    </View>
  );
};

const heightOutSideBottomTab =
  metrics.screenHeight - metrics.heightBottomTab - metrics.statusBarHeight;
const HEIGHT_BLOCK =
  (heightOutSideBottomTab / 2 - sizes.SIZE_50) / sizes.SIZE_2;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: sizes.SIZE_15,
    backgroundColor: colors.COLOR_AREA_CHART_BLUE,
    height: HEIGHT_BLOCK,
    borderRadius: sizes.SIZE_15,
    position: 'relative',
    width: '49%',
    borderBottomLeftRadius: sizes.ZERO,
    borderBottomRightRadius: sizes.ZERO,
  },
  areaChart: {
    height: HEIGHT_BLOCK / 2.5,
    width: '100%',
    bottom: sizes.ZERO,
    position: 'absolute',
  },
  contentContainer: {
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
    paddingTop: sizes.SIZE_10,
    paddingHorizontal: sizes.SIZE_15,
  },
  wrapInfo: {},
  title: {
    fontFamily: fonts.lexendDeca.FONT_MEDIUM,
    fontSize: sizes.SIZE_12,
  },
  total: {
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    fontSize: sizes.SIZE_20,
    marginTop: sizes.SIZE_5,
  },
  iconTotal: {
    width: metrics.screenWidth / sizes.SIZE_16,
    height: metrics.screenWidth / sizes.SIZE_16,
    alignSelf: 'flex-start',
  },
});

export default BlockFilterSearchComponent;
