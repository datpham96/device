import React from 'react';
import {ImageBackground, StyleSheet, StatusBar, View} from 'react-native';
import {colors} from '../config/styles';
import {isIphoneX} from 'react-native-iphone-x-helper';
import images from '../config/images';

export type Props = {
  bin?: boolean;
  bout?: boolean;
  children?: any;
};

const Background: React.FC<Props> = ({bin, bout, children}) => {
  return (
    <View style={styles.container}>
      <StatusBar animated={true} barStyle={'light-content'} />
      {bin && (
        <ImageBackground
          source={images.backgrounds.background_in}
          resizeMode="cover"
          style={styles.image}>
          {children}
        </ImageBackground>
      )}
      {bout && (
        <ImageBackground
          source={images.backgrounds.background_out}
          resizeMode="cover"
          style={styles.image}>
          {children}
        </ImageBackground>
      )}
    </View>
  );
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

export default Background;
