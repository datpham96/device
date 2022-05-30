import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
//node_modules
import Spinner from 'react-native-loading-spinner-overlay';
//api
//base
//components
//config
import {colors, commonStyles, sizes} from 'styles';
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
  isLoading?: any;
};

const LoadingComponent: React.FC<Props> = ({isLoading}) => {
  return (
    <Spinner
      visible={isLoading}
      children={
        <View style={styles.container}>
          <ActivityIndicator
            style={styles.activityIndicator}
            color={colors.COLOR_BLUE}
          />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
    ...commonStyles.center,
  },
  activityIndicator: {
    padding: sizes.SIZE_20,
    borderRadius: sizes.SIZE_10,
    backgroundColor: colors.COLOR_WHITE,
  },
});

export default LoadingComponent;
