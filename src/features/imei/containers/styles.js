import {StyleSheet} from 'react-native';
import {colors, commonStyles, sizes} from 'styles';

export default StyleSheet.create({
  container: {
    paddingHorizontal: sizes.SIZE_20,
    marginTop: '20%',
  },
  mainTitleStyle: {},
  btn: {
    alignSelf: 'center',
    marginTop: sizes.SIZE_40,
  },
  wrapInputImei: {
    marginTop: sizes.SIZE_40,
  },
  wrapBtnIcon: {
    backgroundColor: colors.COLOR_BLUE,
    borderRadius: sizes.SIZE_30,
    ...commonStyles.center,
    paddingHorizontal: sizes.SIZE_10,
    height: sizes.SIZE_36,
    alignSelf: 'center',
    marginRight: -sizes.SIZE_15,
  },
  labelBtnIcon: {},
});
