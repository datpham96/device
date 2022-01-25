import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {colors, commonStyles} from 'styles';

export type Props = {
  isLoading?: any;
};

const LoadingComponent: React.FC<Props> = ({isLoading}) => {
  return (
    <Spinner
      visible={isLoading}
      children={
        <View style={[commonStyles.flex1, commonStyles.center]}>
          <ActivityIndicator color={colors.COLOR_WHITE} />
        </View>
      }
    />
  );
};

export default LoadingComponent;
