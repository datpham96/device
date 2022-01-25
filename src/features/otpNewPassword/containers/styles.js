import {StyleSheet} from 'react-native';
import {commonStyles, sizes, colors, fonts} from 'styles';

export default StyleSheet.create({
  inputPhoneContainer: {},
  inputPasswordContainer: {
    marginTop: sizes.SIZE_20,
  },
  mainTitle: {
    marginVertical: sizes.SIZE_40,
  },
  contentContainer: {
    paddingHorizontal: sizes.SIZE_30,
    marginTop: sizes.SIZE_50,
  },
  btn: {
    alignSelf: 'center',
    marginTop: sizes.SIZE_30,
  },
  wrapTextOtp: {
    ...commonStyles.center,
    ...commonStyles.flexRowCenter,
    marginTop: sizes.SIZE_30,
  },
  digitStyle: {
    backgroundColor: 'transparent',
  },
  digitTxtStyle: {
    color: colors.COLOR_WHITE,
    fontSize: sizes.SIZE_14,
    fontFamily: fonts.lexendDeca.FONT_BOLD,
  },
});
