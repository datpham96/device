import React from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';
import Text from './Text';
import {colors, commonStyles, sizes} from '../config/styles';

export type Props = {
  onPress?: any;
  label?: any;
  customStyle?: any;
  customLabelStyle?: any;
};

const Button: React.FC<Props> = ({
  onPress,
  label,
  customStyle,
  customLabelStyle,
}) => {
  let countVocal = label ? label.split(' ').length : 0;
  return (
    <TouchableHighlight
      underlayColor={colors.COLOR_UNDERLAY_BLUE}
      style={[
        styles.container,
        // eslint-disable-next-line react-native/no-inline-styles
        countVocal > 2 ? {paddingHorizontal: 15} : {paddingHorizontal: 30},
        customStyle,
      ]}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text style={[styles.text, customLabelStyle]}>{label}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.COLOR_BLUE,
    alignSelf: 'baseline',
    height: sizes.SIZE_40,
    ...commonStyles.center,
    borderRadius: sizes.SIZE_20,
    borderWidth: sizes.SIZE_2,
    borderColor: colors.COLOR_WHITE,
  },
  text: {},
});

export default Button;
