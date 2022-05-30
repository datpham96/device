import React from 'react';
import {View, StyleSheet} from 'react-native';
//node_modules
import {AreaChart} from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import FastImage from 'react-native-fast-image';
import lodash from 'lodash';
//api
//base
import {Text} from 'base';
//components
import {NumberPlaceholder} from '../placeholders';
//config
import {colors, commonStyles, fonts, sizes} from 'styles';
import metrics from 'metrics';
//helpers
import {landmarkUnitOfNumber} from 'helpers/funcs';
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
//code-splitting
//screen

const BlockFilterSearchComponent = ({
  data = [],
  iconImage,
  title,
  total,
  svgFillColor,
  containerStyle,
  areaChartStyle,
  heightBlock,
  heightAreaBlock,
  isLoading,
}) => {
  let maxNumber = 0,
    unitNumber = 0;
  try {
    maxNumber = lodash.max(data);
    unitNumber = landmarkUnitOfNumber(maxNumber)
      ? landmarkUnitOfNumber(maxNumber)
      : 0;
  } catch (error) {}

  return (
    <View style={[styles.container, {height: heightBlock}, containerStyle]}>
      <>
        <AreaChart
          style={[styles.areaChart, {height: heightAreaBlock}, areaChartStyle]}
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
          style={[styles.areaChart, areaChartStyle]}
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
          {isLoading ? (
            <View style={styles.wrapNumberPlaceholder}>
              <NumberPlaceholder
                customStyle={{
                  height: sizes.SIZE_16,
                }}
              />
            </View>
          ) : (
            <Text style={styles.total}>{total}</Text>
          )}
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
    borderRadius: sizes.SIZE_10,
    position: 'relative',
    width: '49%',
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
  wrapNumberPlaceholder: {
    marginTop: sizes.SIZE_10,
  },
});

function areEqual(prevProps, nextProps) {
  return (
    prevProps?.total === nextProps?.total &&
    prevProps?.heightBlock === nextProps?.heightBlock &&
    prevProps?.heightAreaBlock === nextProps?.heightAreaBlock &&
    prevProps?.total === nextProps?.total &&
    prevProps?.isLoading === nextProps?.isLoading
  );
}

export default React.memo(BlockFilterSearchComponent, areEqual);
