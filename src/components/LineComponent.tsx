import React from 'react';
import {View, StyleSheet} from 'react-native';
//node_modules
//api
//base
//components
//config
import {colors, sizes} from 'styles';
//helpers
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
//code-splitting
//screen

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
