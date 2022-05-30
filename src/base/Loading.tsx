import React from 'react';
import {ActivityIndicator} from 'react-native';
//node_modules
//api
//base
//components
//config
import {colors} from 'styles';
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
