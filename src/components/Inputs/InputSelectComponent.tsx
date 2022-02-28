import React, {useState} from 'react';
import {Platform} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {colors, fonts, sizes} from 'styles';
import metrics from 'metrics';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export type Props = {
  listData?: any;
  placeholder?: any;
  onDonePress?: any;
  selectedValue?: any;
};

const InputSelectComponent: React.FC<Props> = ({
  listData,
  placeholder,
  onDonePress,
  selectedValue = '',
}) => {
  const [value, setValue] = useState(selectedValue);
  return (
    <RNPickerSelect
      placeholder={{
        label: placeholder,
        value: '',
      }}
      value={value}
      onValueChange={val => {
        setValue(val);
        if (Platform.OS === 'android') {
          onDonePress(val);
        }
      }}
      items={listData}
      doneText="Xác nhận"
      onDonePress={() => onDonePress(value)}
      fixAndroidTouchableBug={true}
      Icon={() => {
        if (Platform.OS === 'ios') {
          return (
            <FontAwesome
              color={colors.COLOR_BLACK}
              size={sizes.SIZE_20}
              name="angle-down"
            />
          );
        } else {
          return <></>;
        }
      }}
      style={{
        inputIOS: {
          color: colors.COLOR_BLACK,
          backgroundColor: colors.COLOR_WHITE,
          height: metrics.heightInput,
          borderRadius: sizes.SIZE_30,
          paddingHorizontal: sizes.SIZE_27,
        },
        inputAndroid: {
          color: colors.COLOR_BLACK,
          paddingHorizontal: sizes.SIZE_27,
          // backgroundColor: 'red',
        },
        inputAndroidContainer: {
          // width: 200,
          // borderRadius: sizes.SIZE_30,
          // backgroundColor: colors.COLOR_WHITE,
        },
        placeholder: {
          color: colors.COLOR_PLACEHOLDER,
          fontSize: sizes.SIZE_14,
          fontFamily: fonts.lexendDeca.FONT_REGULAR,
        },
        iconContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          height: metrics.heightInput,
          marginRight: sizes.SIZE_15,
        },
        viewContainer: {
          ...Platform.select({
            android: {
              backgroundColor: colors.COLOR_WHITE,
              // paddingHorizontal: sizes.SIZE_10,
              borderRadius: sizes.SIZE_30,
              height: metrics.heightInput,
              justifyContent: 'center',
            },
          }),
        },
      }}
    />
  );
};

export default InputSelectComponent;
