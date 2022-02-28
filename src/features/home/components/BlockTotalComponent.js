import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'base';
import {AreaChart} from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {colors, commonStyles, fonts, sizes} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import metrics from 'metrics';
import lodash from 'lodash';
import {landmarkUnitOfNumber} from 'src/helpers/funcs';

const heightOutSideBottomTab =
  metrics.screenHeight - metrics.heightBottomTab - metrics.statusBarHeight;
const HEIGHT_BLOCK =
  (heightOutSideBottomTab / sizes.SIZE_2 - sizes.SIZE_50) / sizes.SIZE_2;

const DATA = [
  24, 50, 13, 5, 20, 43, 35, 27, 44, 3, 10, 14, 29, 34, 30, 23, 32, 17, 48, 26,
  12, 2, 30, 25,
];

const BlockTotalComponent = ({
  data = [],
  total,
  containerStyle,
  areaChartStyle,
  sizeIcon,
}) => {
  const maxNumber = lodash.max(data);
  const unitNumber = landmarkUnitOfNumber(maxNumber)
    ? landmarkUnitOfNumber(maxNumber)
    : 0;
  return (
    <View style={[styles.container, containerStyle]}>
      <>
        <AreaChart
          style={[styles.areaChart, areaChartStyle]}
          data={data?.map(val => {
            return unitNumber > 0
              ? Math.ceil(val / unitNumber) * 1.5
              : unitNumber;
          })}
          contentInset={{top: sizes.SIZE_10, bottom: sizes.ZERO}}
          curve={shape.curveNatural}
          xMin={0}
          yMin={0}
          svg={{fill: colors.COLOR_WHITE}}
          animate={true}
          animationDuration={500}
        />
        <AreaChart
          style={[styles.areaChart, areaChartStyle]}
          data={data?.map(val => {
            return unitNumber > 0 ? Math.ceil(val / unitNumber) : unitNumber;
          })}
          xMin={0}
          yMin={0}
          contentInset={{top: sizes.SIZE_18, bottom: sizes.ZERO}}
          curve={shape.curveNatural}
          svg={{fill: colors.COLOR_AREA_CHART_GREEN_BOW}}
          animate={true}
          animationDuration={500}
        />
      </>
      {/* <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: sizes.ZERO,
          height: sizes.ZERO,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderTopWidth: 5,
          borderRightWidth: 0,
          borderBottomWidth: 20,
          borderLeftWidth: 20,
          borderRadius: 5,
          // borderRadius: 10,
          borderTopColor: 'transparent',
          borderRightColor: colors.COLOR_RED_ORANGE,
          borderBottomColor: colors.COLOR_RED_ORANGE,
          borderLeftColor: 'transparent',
          // marginTop: -sizes.SIZE_9,
          zIndex: 0,
        }}
      /> */}
      <View style={styles.contentContainer}>
        <View style={styles.wrapInfo}>
          <Text style={styles.title}>Tổng truy vấn</Text>
          <Text style={styles.total}>{total}</Text>
        </View>
        <FastImage
          style={[styles.iconTotal, sizeIcon]}
          source={images.icons.area_chart_total}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.COLOR_AREA_CHART_BLUE,
    height: HEIGHT_BLOCK,
    borderRadius: sizes.SIZE_10,
    position: 'relative',
    overflow: 'hidden',
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
    fontSize: sizes.SIZE_18,
  },
  total: {
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    fontSize: sizes.SIZE_25,
    marginTop: sizes.SIZE_5,
  },
  iconTotal: {
    width: HEIGHT_BLOCK / sizes.SIZE_3,
    height: HEIGHT_BLOCK / sizes.SIZE_3,
    alignSelf: 'flex-start',
  },
});

export default React.memo(BlockTotalComponent);
