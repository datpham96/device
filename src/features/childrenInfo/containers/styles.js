import {StyleSheet} from 'react-native';
import {sizes, commonStyles, colors, fonts} from 'styles';
import metrics from 'metrics';

export default StyleSheet.create({
  container: {
    marginTop: sizes.SIZE_30,
    ...commonStyles.flex1,
  },
  scrollContainer: {
    ...commonStyles.flex1,
    paddingHorizontal: sizes.SIZE_20,
  },
  mainTitleStyle: {
    paddingHorizontal: sizes.SIZE_20,
  },
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
  expiredLabel: {
    color: colors.COLOR_ERROR,
  },
  infoName: {},
  btnCancel: {
    backgroundColor: colors.COLOR_PINK,
    paddingHorizontal: sizes.SIZE_15,
    ...commonStyles.center,
    borderRadius: sizes.SIZE_20,
    height: sizes.SIZE_32,
  },
  labelBtnCancel: {
    fontSize: sizes.SIZE_13,
  },
  btnSetup: {
    backgroundColor: colors.COLOR_BLUE,
    paddingHorizontal: sizes.SIZE_15,
    ...commonStyles.center,
    borderRadius: sizes.SIZE_20,
    height: sizes.SIZE_32,
    marginLeft: sizes.SIZE_10,
  },
  labelBtnSetup: {
    fontSize: sizes.SIZE_13,
  },
  btnRedirect: {
    marginTop: sizes.SIZE_15,
  },
  wrapBtn: {
    ...commonStyles.flexRowCenter,
    marginVertical: sizes.SIZE_15,
  },
  //setting
  settingContainer: {
    marginTop: sizes.SIZE_20,
  },
  wrapSafeWeb: {
    // ...commonStyles.flexRowCenter,
    marginBottom: sizes.SIZE_20,
  },
  headerSafeWeb: {
    ...commonStyles.flexRowCenter,
  },
  switchSafeWeb: {
    alignSelf: 'center',
  },
  contentSafeWeb: {
    marginTop: sizes.SIZE_15,
    textAlign: 'justify',
    fontSize: sizes.SIZE_12,
    fontFamily: fonts.lexendDeca.FONT_LIGHT,
  },
  iconInfo: {
    width: sizes.SIZE_40,
    height: sizes.SIZE_40,
  },
  labelInfo: {
    fontFamily: fonts.lexendDeca.FONT_MEDIUM,
    fontSize: sizes.SIZE_14,
    ...commonStyles.flex1,
    paddingHorizontal: sizes.SIZE_10,
  },
  lineOne: {
    marginVertical: sizes.SIZE_20,
  },
});
