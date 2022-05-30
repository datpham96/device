import React from 'react';
import {View, StyleSheet} from 'react-native';
//node_modules
import {Switch} from 'react-native-switch';
//api
//base
//components
//config
import {colors, sizes} from 'styles';
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
  value?: any;
  onValueChange?: any;
  containerStyle?: any;
};

const SwitchToggle: React.FC<Props> = ({
  value,
  onValueChange,
  containerStyle,
}) => {
  return (
    <View
      style={[
        styles.container,
        {borderColor: value ? colors.COLOR_GREEN : colors.COLOR_RED_ORANGE},
        containerStyle,
      ]}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        renderActiveText={false}
        renderInActiveText={false}
        circleBorderWidth={0}
        circleSize={sizes.SIZE_18}
        switchBorderRadius={sizes.SIZE_20}
        switchLeftPx={1.9}
        switchRightPx={1.9}
        switchWidthMultiplier={2.2}
        circleActiveColor={colors.COLOR_GREEN}
        circleInActiveColor={colors.COLOR_RED_ORANGE}
        backgroundActive="transparent"
        backgroundInactive="transparent"
        barHeight={sizes.SIZE_21}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: sizes.SIZE_3,
    borderRadius: sizes.SIZE_20,
    alignSelf: 'baseline',
  },
  outerCircle: {
    borderWidth: sizes.SIZE_1,
    borderColor: '#fff',
  },
});

export default SwitchToggle;
