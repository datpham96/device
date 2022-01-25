import React from 'react';
import {View} from 'react-native';
import {Loading} from 'base';
import {commonStyles} from 'styles';

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
