import React from 'react';
import {StyleSheet} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {colors} from '../config/styles';

const withLoadingData = (WrappedComponent, isLoading, isSuccess) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {}

    render() {
      return <WrappedComponent />;
    }
  };
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   image: {
//     flex: 1,
//     paddingTop: isIphoneX() ? 44 : 0,
//     paddingBottom: isIphoneX() ? 34 : 0,
//   },
//   text: {
//     color: colors.COLOR_WHITE,
//   },
// });

export default withLoadingData;
