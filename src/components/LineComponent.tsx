import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, sizes} from 'styles';

export type Props = {
  customStyle?: any;
};

const LineComponent: React.FC<Props> = ({customStyle}) => {
  return <View style={[styles.line, customStyle]} />;
};

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: sizes.SIZE_2,
    backgroundColor: colors.COLOR_WHITE,
  },
});

export default LineComponent;
