import React from 'react';
import {TouchableHighlight, StyleSheet, View} from 'react-native';
//node_modules
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//api
//base
import {Text} from 'base';
//components
//config
import {colors, commonStyles, fonts, sizes} from 'styles';
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
