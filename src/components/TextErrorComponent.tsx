import React from 'react';
import {StyleSheet} from 'react-native';
//node_modules
//api
//base
import {Text} from 'base';
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
  message?: any;
  containerStyle?: any;
};

const TextErrorComponent: React.FC<Props> = ({message, containerStyle}) => {
  return <Text style={[styles.message, containerStyle]}>{message}</Text>;
};

const styles = StyleSheet.create({
  message: {
    color: colors.COLOR_ERROR,
    marginTop: sizes.SIZE_5,
    marginHorizontal: sizes.SIZE_25,
  },
});

export default TextErrorComponent;
