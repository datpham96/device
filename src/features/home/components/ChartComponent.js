import React, {useState, useMemo, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
//node_modules
//api
//base
import {Text} from 'base';
//components
import {PieChart} from 'components';

//config
import {colors, commonStyles, fonts, sizes} from 'styles';
//helpers
import {checkVar, formatNumberThousand} from 'helpers/funcs';
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
import {NumberPlaceholder, PieCharPlaceholder} from '../placeholders';
import types from '../types';
//code-splitting
//screen

const ChartComponent = ({
  dataReportAccess,
  isSuccessReportAccess,
  isLoadingReportAccess,
  dataDeviceList,
}) => {
  const [pieChartActive, setPieChartActive] = useState(0);

  const handleActivePieChart = useCallback(key => {
    setPieChartActive(key);
  }, []);

  //format report list
  const dataPieChartList = useMemo(() => {
    let tmpDataList = [];
    if (isSuccessReportAccess && !checkVar.isEmpty(dataReportAccess)) {
      let totalRequest = dataReportAccess?.total_request?.total_request;
      let totalBlocked = dataReportAccess?.blocked?.total_blocked;
      let totalAccess = totalRequest - totalBlocked;
      let percentBlock = (totalAccess / totalRequest) * 100;
      tmpDataList.push({
        value: parseFloat(percentBlock.toFixed(1)),
        color: colors.COLOR_CHART_BLUE,
        label: types.status.allow.name,
        code: types.status.allow.code,
        total: totalAccess,
      });
      tmpDataList.push({
        value: parseFloat((100 - percentBlock).toFixed(1)),
        color: colors.COLOR_CHART_RED,
        label: types.status.block.name,
        code: types.status.block.code,
        total: totalBlocked,
      });
    }

    return tmpDataList;
  }, [dataReportAccess, isSuccessReportAccess]);

  return (
    <View style={styles.chartContainer}>
      {isLoadingReportAccess ? (
        <PieCharPlaceholder />
      ) : dataDeviceList && dataDeviceList?.data?.length > 0 ? (
        <PieChart
          selectedKey={pieChartActive}
          onSelected={handleActivePieChart}
          dataList={dataPieChartList}
        />
      ) : (
        <></>
      )}
      <View style={styles.wrapParams}>
        <View
          activeOpacity={0.9}
          onPress={() => console.log('website')}
          style={styles.paramInfo}>
          <Text style={styles.paramInfoLabel}>Th???ng k??</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleActivePieChart(0)}
            style={styles.wrapParamInfoValue}>
            <View
              style={[
                styles.paramInfoValueDot,
                {backgroundColor: colors.COLOR_CHART_BLUE},
              ]}
            />
            <View style={styles.wrapReportLabel}>
              <Text
                style={[
                  styles.paramInfoValue,
                  pieChartActive === 0
                    ? {fontFamily: fonts.lexendDeca.FONT_BOLD}
                    : {},
                ]}>
                {types.status.allow.name}:{' '}
              </Text>
              {!isLoadingReportAccess ? (
                <Text>
                  {formatNumberThousand(dataPieChartList?.[0]?.total)}
                </Text>
              ) : (
                <View>
                  <NumberPlaceholder />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleActivePieChart(1)}
            style={styles.wrapParamInfoValue}>
            <View
              style={[
                styles.paramInfoValueDot,
                {backgroundColor: colors.COLOR_CHART_RED},
              ]}
            />
            <View style={styles.wrapReportLabel}>
              <Text
                style={[
                  styles.paramInfoValue,
                  pieChartActive === 1
                    ? {fontFamily: fonts.lexendDeca.FONT_BOLD}
                    : {},
                ]}>
                {types.status.block.name}:{' '}
              </Text>
              {!isLoadingReportAccess ? (
                <Text>
                  {formatNumberThousand(dataPieChartList?.[1]?.total)}
                </Text>
              ) : (
                <View>
                  <NumberPlaceholder />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    // ...commonStyles.flex1,
    marginVertical: sizes.SIZE_15,
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_15,
    // marginTop: sizes.SIZE_25,
  },
  wrapParams: {
    // backgroundColor: 'green',
    width: '40%',
    alignItems: 'center',
  },
  paramInfo: {
    marginBottom: sizes.SIZE_25,
  },
  paramInfoLabel: {
    fontSize: sizes.SIZE_16,
    fontFamily: fonts.lexendDeca.FONT_REGULAR,
    marginBottom: sizes.SIZE_10,
  },
  wrapParamInfoValue: {
    ...commonStyles.flexRowCenter,
    marginTop: sizes.SIZE_10,
  },
  paramInfoValueDot: {
    width: sizes.SIZE_15,
    height: sizes.SIZE_15,
    backgroundColor: colors.COLOR_CHART_BLUE,
    borderRadius: sizes.SIZE_15 / sizes.SIZE_2,
    borderWidth: sizes.SIZE_2,
    borderColor: colors.COLOR_WHITE,
  },
  wrapReportLabel: {
    ...commonStyles.flexRowCenter,
  },
  paramInfoValue: {
    marginLeft: sizes.SIZE_10,
    fontSize: sizes.SIZE_13,
  },
});

export default React.memo(ChartComponent);
