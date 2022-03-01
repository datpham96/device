import {StyleSheet} from 'react-native';
import {colors, commonStyles, fonts, sizes} from 'styles';
import metrics from 'metrics';

export default StyleSheet.create({
  container: {
    paddingHorizontal: sizes.SIZE_20,
    marginTop: sizes.SIZE_30,
    ...commonStyles.flex1,
  },
  mainTitleStyle: {
    textAlign: 'center',
    marginTop: sizes.SIZE_30,
  },
  wrapDateNumber: {
    marginTop: sizes.SIZE_25,
    ...commonStyles.center,
  },
  dateNumber: {
    fontSize: sizes.SIZE_40,
    fontFamily: fonts.montserrat.FONT_BOLD,
  },
  dateLabel: {
    fontSize: sizes.SIZE_22,
    fontFamily: fonts.montserrat.FONT_BOLD,
  },
  descriptionTime: {
    textAlign: 'center',
    marginTop: sizes.SIZE_25,
  },
  wrapInput: {
    marginTop: sizes.SIZE_25,
  },
  customInput: {
    textAlign: 'center',
    fontSize: sizes.SIZE_16,
  },
  wrapBtn: {
    marginTop: sizes.SIZE_40,
    ...commonStyles.center,
  },
  btn: {
    alignSelf: 'auto',
  },
  expiredDate: {
    textAlign: 'center',
    marginTop: sizes.SIZE_25,
  },
});
