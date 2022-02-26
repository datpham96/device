import {StyleSheet} from 'react-native';
import {sizes, commonStyles, colors, fonts} from 'styles';
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
    paddingHorizontal: sizes.SIZE_15,
    ...commonStyles.center,
    borderRadius: sizes.SIZE_20,
    height: sizes.SIZE_32,
  },
  labelBtnCancel: {
    fontSize: sizes.SIZE_13,
  },
  btnSetup: {
    marginVertical: sizes.SIZE_25,
    backgroundColor: colors.COLOR_BLUE,
    paddingHorizontal: sizes.SIZE_15,
    ...commonStyles.center,
    borderRadius: sizes.SIZE_20,
    height: sizes.SIZE_32,
    width: sizes.SIZE_105,
    marginLeft: sizes.SIZE_10,
  },
  labelBtnSetup: {
    fontSize: sizes.SIZE_13,
  },
  btnRedirect: {
    marginTop: sizes.SIZE_20,
  },
  wrapBtn: {
    flexDirection: 'row',
  },
  //setting
  settingContainer: {
    marginTop: sizes.SIZE_25,
  },
  wrapSafeWeb: {
    // ...commonStyles.flexRowCenter,
    marginBottom: sizes.SIZE_25,
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
