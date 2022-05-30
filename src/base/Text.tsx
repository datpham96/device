import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';
//node_modules
//api
//base
//components
//config
import {colors, fonts, sizes} from 'styles';
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
  children?: any;
  style?: any;
  onPress?: any;
  props?: any;
};

const Text: React.FC<Props> = ({style, children, onPress, props}) => {
  return (
    <RNText
      suppressHighlighting={true}
      {...props}
      onPress={onPress}
      style={[styles.text, style]}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: sizes.SIZE_14,
    fontFamily: fonts.lexendDeca.FONT_REGULAR,
    color: colors.COLOR_WHITE,
  },
});

export default Text;
