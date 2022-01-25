import React from 'react';
import {View} from 'react-native';
import {Text} from 'base';
import {commonStyles} from 'styles';

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
