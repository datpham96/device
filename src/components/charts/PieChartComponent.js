import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import metrics from 'metrics';
import {colors, fonts, sizes} from 'styles';
import {checkVar} from 'src/helpers/funcs';

const widthChart = metrics.screenWidth / 2.2;

const PieChartComponent = ({dataList, onSelected, selectedKey = 0}) => {
  const [labelWidth, setLabelWidth] = useState('');
  const data = useMemo(() => {
    return dataList.map((label, index) => {
      return {
        index,
        key: index,
        value: dataList[index].value,
        svg: {fill: dataList[index].color},
        arc: {
          outerRadius: index === selectedKey ? sizes.SIZE_100 + '%' : '98%',
          // padAngle: label === index ? 0.1 : 0,
        },
        onPress: () => {
          onSelected(index);
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataList, selectedKey]);

  return (
    <View style={styles.container}>
      <PieChart
        style={[styles.piechartContainer]}
        valueAccessor={({item}) => item.value}
        data={data}
        spacing={sizes.ZERO}
        outerRadius={'95%'}
        innerRadius={'40%'}
        startAngle={sizes.ZERO}
        padAngle={sizes.ZERO}
      />
      <Text
        onLayout={({
          nativeEvent: {
            layout: {width},
          },
        }) => {
          setLabelWidth(width);
        }}
        style={[
          styles.textLabel,
          {
            left: widthChart / sizes.SIZE_2 - labelWidth / sizes.SIZE_2,
          },
        ]}>
        {!checkVar.isEmpty(dataList) &&
        dataList?.[selectedKey] &&
        dataList?.[selectedKey]?.value
          ? `${dataList?.[selectedKey]?.value}%`
          : '0%'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  piechartContainer: {
    height: widthChart,
    width: widthChart,
  },
  container: {
    justifyContent: 'center',
  },
  textLabel: {
    position: 'absolute',
    fontSize: sizes.SIZE_21,
    textAlign: 'center',
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    color: colors.COLOR_WHITE,
  },
});

export default React.memo(PieChartComponent);
