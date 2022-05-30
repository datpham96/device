import React from 'react';
import {View, StyleSheet, TextInput, Image} from 'react-native';
//node_modules
import {TouchableOpacity} from 'react-native-gesture-handler';
//api
//base
//components
//config
import {colors, sizes} from 'styles';
import metrics from 'metrics';
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
  customerInput?: any;
  value?: any;
  onChangeValue?: any;
  containerInput?: any;
  props?: any;
  placeholder?: any;
  icon?: any;
  iconComponent?: any;
  onPressIcon?: any;
};

const Input: React.FC<Props> = ({
  customerInput,
  value,
  onChangeValue,
  containerInput,
  props,
  placeholder,
  icon,
  iconComponent,
  onPressIcon,
}) => {
  return (
    <View style={[styles.container, containerInput]}>
      <View style={styles.wrapInput}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.COLOR_PLACEHOLDER}
          value={value}
          onChangeText={text => onChangeValue(text)}
          style={[styles.input, customerInput]}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
          autoCapitalize="none"
          autoCompleteType={'off'}
          {...props}
        />
        {icon && (
          <TouchableOpacity
            style={styles.wrapIcon}
            activeOpacity={1}
            onPress={onPressIcon}>
            <Image style={styles.imageIcon} source={icon} />
          </TouchableOpacity>
        )}
        {iconComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: metrics.heightInput,
    backgroundColor: colors.COLOR_WHITE,
    borderRadius: sizes.SIZE_30,
  },
  wrapInput: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: sizes.SIZE_20,
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  wrapIcon: {},
  imageIcon: {
    width: sizes.SIZE_20,
    height: sizes.SIZE_20,
  },
  input: {
    borderRadius: sizes.SIZE_20,
    flex: sizes.SIZE_1,
    backgroundColor: colors.COLOR_WHITE,
    paddingHorizontal: sizes.SIZE_5,
    color: colors.COLOR_BLACK,
    height: sizes.SIZE_44,
  },
});

export default Input;
