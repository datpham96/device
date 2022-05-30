import React from 'react';
import {View} from 'react-native';
//node_modules
//api
//base
import {Loading} from 'base';
//components
//config
import {commonStyles} from 'styles';
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

const LoadingDataComponent: React.FC<Props> = ({size, color}) => {
  return (
    <View style={[commonStyles.flex1, commonStyles.center]}>
      <Loading size={size} color={color} />
    </View>
  );
};

export default LoadingDataComponent;
