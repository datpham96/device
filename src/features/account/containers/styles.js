import {StyleSheet} from 'react-native';
import {colors, commonStyles, sizes} from 'styles';
import metrics from 'metrics';

const SIZE_AVATAR = metrics.screenWidth / sizes.SIZE_4;
const SIZE_ICON_AVATAR = SIZE_AVATAR / sizes.SIZE_4;

export default StyleSheet.create({
  container: {
    paddingHorizontal: sizes.SIZE_20,
    marginTop: sizes.SIZE_30,
    ...commonStyles.flex1,
  },
  mainTitleStyle: {
    ...commonStyles.flexRowCenter,
    marginTop: sizes.SIZE_30,
  },
  wrapAvatar: {
    alignSelf: 'center',
    width: SIZE_AVATAR,
    height: SIZE_AVATAR,
    marginTop: sizes.SIZE_30,
    marginBottom: sizes.SIZE_15,
  },
  avatar: {
    width: SIZE_AVATAR,
    height: SIZE_AVATAR,
    borderRadius: SIZE_AVATAR / sizes.SIZE_2,
  },
  iconCapturePlus: {
    width: SIZE_ICON_AVATAR,
    height: SIZE_ICON_AVATAR,
    position: 'absolute',
    bottom: sizes.ZERO,
    right: sizes.ZERO,
  },
  wrapInput: {
    marginTop: sizes.SIZE_25,
  },
  btnChangePassword: {
    alignSelf: 'flex-end',
    marginTop: sizes.SIZE_25,
  },
  wrapBtn: {
    marginTop: sizes.SIZE_25,
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
  },
  btn: {
    alignSelf: 'auto',
    width: '46%',
  },
  version: {
    textAlign: 'center',
    // position: 'absolute',
    bottom: sizes.SIZE_20,
  },
  wrapActivityIndicator: {
    width: '100%',
    height: '100%',
    ...commonStyles.center,
    position: 'absolute',
    borderWidth: sizes.SIZE_1,
    borderColor: colors.COLOR_WHITE,
    borderRadius: sizes.SIZE_100,
  },
});
