import React from 'react';
import {StyleSheet} from 'react-native';
//node_modules
import moment from 'moment';
import DatePicker from 'react-native-date-picker-select';
//api
//base
//components
//config
import metrics from 'metrics';
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

const DateTimePickerComponent = React.forwardRef(({date, onDate}, ref) => {
  return (
    <DatePicker
      ref={ref}
      locale="vi"
      mode="date"
      date={date}
      confirmBtnText="Xác nhận"
      cancelBtnText="Hủy"
      showIcon={false}
      placeholder={''}
      androidMode="spinner"
      style={styles.datePicker}
      customStyles={{
        btnTextConfirm: {
          color: colors.COLOR_BLUE,
        },
        datePicker: {
          backgroundColor: metrics.colorScheme === 'dark' ? '#222' : 'white',
        },
        datePickerCon: {
          backgroundColor: metrics.colorScheme === 'dark' ? '#333' : 'white',
        },
      }}
      format="DD/MM/YYYY"
      maxDate={moment().format('DD/MM/YYYY').toString()}
      onDateChange={val => onDate(val)}
    />
  );
});

const styles = StyleSheet.create({
  datePicker: {
    width: sizes.ZERO,
    height: sizes.ZERO,
  },
});

export default DateTimePickerComponent;
