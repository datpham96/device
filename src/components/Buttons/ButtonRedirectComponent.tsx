import React from 'react';
import {Text} from 'base';
import {colors, commonStyles, fonts, sizes} from 'styles';
import {TouchableHighlight, StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type Props = {
  onPress?: any;
  label?: any;
  containerStyle?: any;
  labelStyle?: any;
};

const ButtonRedirectComponent: React.FC<Props> = ({
  onPress,
  label,
  containerStyle,
  labelStyle,
}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={colors.COLOR_UNDERLAY_BUTTON_WHITE}
      style={[styles.container, containerStyle]}>
      <View style={styles.wrapContent}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        <MaterialCommunityIcons
          name="chevron-right"
          color={colors.COLOR_BLACK}
          size={sizes.SIZE_25}
        />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: sizes.SIZE_44,
    backgroundColor: colors.COLOR_WHITE,
    alignSelf: 'baseline',
    paddingHorizontal: sizes.SIZE_15,
    borderRadius: sizes.SIZE_20,
  },
  wrapContent: {
    ...commonStyles.flexRowCenter,
    height: sizes.SIZE_44,
    justifyContent: 'space-between',
  },
  label: {
    color: colors.COLOR_BLACK,
    fontFamily: fonts.montserrat.FONT_REGULAR,
  },
});

export default ButtonRedirectComponent;
