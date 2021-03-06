import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  StatusBar,
  View,
  Platform,
} from 'react-native';
//node_modules
import {
  getBottomSpace,
  getStatusBarHeight,
  isIphoneX,
} from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//api
//base
//components
//config
import {colors, commonStyles, sizes} from 'styles';
import images from 'images';
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
  bin?: boolean;
  bout?: boolean;
  children?: any;
  customContainer?: any;
  customerBackgroundImage?: any;
  isKeyboard?: any;
  bottomTab?: any;
};

const Background: React.FC<Props> = ({
  bin,
  bout,
  children,
  customContainer,
  customerBackgroundImage,
  isKeyboard,
  bottomTab,
}) => {
  return (
    <View style={[styles.container, customContainer]}>
      <StatusBar animated={true} barStyle={'light-content'} />
      {bin && (
        <ImageBackground
          source={images.backgrounds.background_in}
          resizeMode="stretch"
          style={[
            styles.image,
            bottomTab ? styles.bottomTab : {},
            customerBackgroundImage,
          ]}>
          {isKeyboard ? (
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              extraScrollHeight={sizes.SIZE_20}
              style={styles.keyboard}>
              {children}
            </KeyboardAwareScrollView>
          ) : (
            children
          )}
        </ImageBackground>
      )}
      {bout && (
        <ImageBackground
          source={images.backgrounds.background_out}
          resizeMode="stretch"
          style={[
            styles.image,
            bottomTab ? styles.bottomTab : {},
            customerBackgroundImage,
          ]}>
          {isKeyboard ? (
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              extraScrollHeight={sizes.SIZE_20}
              style={styles.keyboard}>
              {children}
            </KeyboardAwareScrollView>
          ) : (
            children
          )}
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
  },
  image: {
    ...commonStyles.flex1,
    paddingTop:
      Platform.OS === 'ios'
        ? isIphoneX()
          ? getStatusBarHeight() + sizes.SIZE_5
          : getStatusBarHeight()
        : sizes.ZERO,
    paddingBottom: isIphoneX() ? getBottomSpace() : sizes.ZERO,
  },
  text: {
    color: colors.COLOR_WHITE,
  },
  bottomTab: {
    // paddingTop: sizes.ZERO,
    paddingBottom: sizes.ZERO,
  },
  keyboard: {},
});

export default Background;
