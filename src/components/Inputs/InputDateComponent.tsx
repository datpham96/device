import metrics from 'metrics';
import React from 'react';
import {StyleSheet} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {colors, sizes} from 'styles';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export type Props = {
  placeholder?: any;
  value?: any;
  onDateChange?: any;
  containerStyle?: any;
};

const InputDateComponent: React.FC<Props> = ({
  placeholder,
  value,
  onDateChange,
  containerStyle,
}) => {
  return (
    <DatePicker
      locale="vi"
      mode="date"
      date={value}
      confirmBtnText="Xác nhận"
      cancelBtnText="Hủy"
      // showIcon={false}
      placeholder={placeholder}
      androidMode="spinner"
      style={[styles.container, containerStyle]}
      format="DD/MM/YYYY"
      maxDate={moment().format('DD-MM-YYYY').toString()}
      onDateChange={date => onDateChange(date)}
      iconComponent={
        <FontAwesome
          color={colors.COLOR_BLACK}
          size={sizes.SIZE_20}
          name="angle-down"
          style={styles.icon}
        />
      }
      customStyles={{
        dateInput: {
          backgroundColor: colors.COLOR_WHITE,
          height: metrics.heightInput,
          borderRadius: sizes.SIZE_30,
          alignItems: 'flex-start',
          paddingHorizontal: sizes.SIZE_25,
          borderWidth: 0,
        },
        btnTextCancel: {
          color: colors.COLOR_BLACK,
        },
        btnTextConfirm: {
          color: colors.COLOR_BLUE,
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  icon: {
    position: 'absolute',
    right: sizes.SIZE_10,
  },
});

export default InputDateComponent;
