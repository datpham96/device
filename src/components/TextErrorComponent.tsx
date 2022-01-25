import React from 'react';
import {Text} from 'base';
import {StyleSheet} from 'react-native';
import {colors, sizes} from 'styles';

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
