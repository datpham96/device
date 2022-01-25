import {StyleSheet} from 'react-native';
import {sizes, colors} from 'styles';
import metrics from 'metrics';

export default StyleSheet.create({
  logo: {
    width: metrics.screenWidth / sizes.SIZE_5,
    height: metrics.screenWidth / sizes.SIZE_5,
    alignSelf: 'center',
  },
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
  labelBtn: {},
  titleNotAccount: {
    textAlign: 'center',
    marginTop: sizes.SIZE_30,
  },
  textRegister: {
    color: colors.COLOR_BLUE,
  },
});
