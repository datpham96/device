import React from 'react';
import {View} from 'react-native';
//node_modules
//api
//base
import {Text} from 'base';
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
  label?: any;
};

const EmptyDataComponent: React.FC<Props> = ({label = 'Dữ liệu trống'}) => {
  return (
    <View style={[commonStyles.flex1, commonStyles.center]}>
      <Text>{label}</Text>
    </View>
  );
};

export default EmptyDataComponent;
