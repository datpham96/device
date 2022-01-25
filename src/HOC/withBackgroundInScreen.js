import React from 'react';
import {ImageBackground, StyleSheet, View, StatusBar, Text} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {colors} from '../config/styles';
import images from 'images';

const withBackgroundInScreen = WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {}

    render() {
      return (
        <View style={styles.container}>
          <StatusBar animated={true} barStyle={'light-content'} />
          <ImageBackground
            source={images.backgrounds.background_in}
            resizeMode="cover"
            style={styles.image}>
            <Text style={styles.text}>
              <WrappedComponent />
            </Text>
          </ImageBackground>
        </View>
      );
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    paddingTop: isIphoneX() ? 44 : 0,
    paddingBottom: isIphoneX() ? 34 : 0,
  },
  text: {
    color: colors.COLOR_WHITE,
  },
});

export default withBackgroundInScreen;
