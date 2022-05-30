import React from 'react';
import {View, StyleSheet} from 'react-native';
//node_modules
import {TouchableOpacity} from 'react-native-gesture-handler';
//api
//base
import Text from './Text';
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
  active?: any;
  label?: any;
  onPress?: any;
  containerStyle?: any;
};
const TRANSPARENT = 'transparent';
const Radio: React.FC<Props> = ({active, label, onPress, containerStyle}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, containerStyle]}
      onPress={onPress}>
      <View style={styles.wrapCircle}>
        <View
          style={[
            styles.circle,
            {backgroundColor: active ? colors.COLOR_RED : TRANSPARENT},
          ]}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const sizeWrapCircle = sizes.SIZE_18;
const sizeCircle = sizeWrapCircle - sizes.SIZE_4;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapCircle: {
    width: sizeWrapCircle,
    height: sizeWrapCircle,
    borderWidth: sizes.SIZE_2,
    borderColor: colors.COLOR_WHITE,
    borderRadius: sizeWrapCircle / sizes.SIZE_2,
    ...commonStyles.center,
  },
  circle: {
    width: sizeCircle,
    height: sizeCircle,
    borderRadius: sizeCircle / 2,
  },
  label: {
    marginLeft: 10,
  },
});

export default Radio;
