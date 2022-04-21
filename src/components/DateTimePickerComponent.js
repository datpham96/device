import metrics from 'metrics';
import moment from 'moment';
import React from 'react';
import {StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker-select';
import {colors, sizes} from 'styles';

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
