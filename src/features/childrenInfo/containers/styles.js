import {StyleSheet} from 'react-native';
import {sizes, commonStyles, colors} from 'styles';
import metrics from 'metrics';

export default StyleSheet.create({
  container: {
    paddingHorizontal: sizes.SIZE_20,
    marginTop: sizes.SIZE_30,
  },
  mainTitleStyle: {},
  wrapAvatar: {
    ...commonStyles.flexRowCenter,
    marginTop: sizes.SIZE_30,
  },
  avatar: {
    width: metrics.screenWidth / sizes.SIZE_5,
    height: metrics.screenWidth / sizes.SIZE_5,
  },
  wrapInfo: {
    marginLeft: sizes.SIZE_15,
  },
  textInfo: {
    marginTop: sizes.SIZE_5,
  },
  infoName: {},
  btnCancel: {
    marginVertical: sizes.SIZE_25,
    backgroundColor: colors.COLOR_PINK,
    alignSelf: 'baseline',
    paddingHorizontal: sizes.SIZE_15,
    ...commonStyles.center,
    borderRadius: sizes.SIZE_20,
    height: sizes.SIZE_32,
  },
  labelBtnCancel: {
    fontSize: sizes.SIZE_13,
  },
  btnRedirect: {
    marginTop: sizes.SIZE_20,
  },
});
