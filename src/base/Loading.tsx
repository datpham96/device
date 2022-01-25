import React from 'react';
import {ActivityIndicator} from 'react-native';
import {colors} from 'styles';

export type Props = {
  size?: any;
  color?: any;
};

const Loading: React.FC<Props> = ({
  size = 'small',
  color = colors.COLOR_WHITE,
}) => {
  return <ActivityIndicator size={size} color={color} />;
};

export default Loading;
