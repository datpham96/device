import {StyleSheet} from 'react-native';
import {commonStyles, sizes, colors} from 'styles';

export default StyleSheet.create({
  container: {
    ...commonStyles.flex1,
    marginTop: sizes.SIZE_30,
  },
  wrapMainTitle: {
    ...commonStyles.flexRowCenter,
  },
  mainTitle: {
    marginLeft: sizes.SIZE_15,
  },
  iconRefresh: {
    width: sizes.SIZE_25,
    height: sizes.SIZE_25,
    marginLeft: sizes.SIZE_10,
  },
  contentContainer: {
    ...commonStyles.flex1,
    ...commonStyles.center,
    backgroundColor: '#fff',
  },
  wrapBtnSelect: {
    width: '45%',
  },
  btn: {
    backgroundColor: colors.COLOR_RED_ORANGE,
    paddingHorizontal: sizes.SIZE_25,
    paddingVertical: sizes.SIZE_10,
    borderRadius: sizes.SIZE_25,
    height: sizes.SIZE_44,
    ...commonStyles.center,
    width: '45%',
  },
  btnLabel: {
    fontSize: sizes.SIZE_13,
  },
  wrapButtonAction: {
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_15,
    marginVertical: sizes.SIZE_25,
  },
  //google map
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapImageMarkers: {
    position: 'relative',
    alignSelf: 'center',
  },
  imageMarker: {
    width: sizes.SIZE_25,
    height: sizes.SIZE_25,
    borderRadius: sizes.SIZE_25 / sizes.SIZE_2,
    borderColor: colors.COLOR_RED_ORANGE,
    borderWidth: sizes.SIZE_1,
    zIndex: 1,
  },
  triangleMarker: {
    width: sizes.ZERO,
    height: sizes.ZERO,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: sizes.SIZE_20,
    borderRightWidth: sizes.SIZE_25 / sizes.SIZE_2,
    borderBottomWidth: sizes.ZERO,
    borderLeftWidth: sizes.SIZE_25 / sizes.SIZE_2,
    borderTopColor: colors.COLOR_RED_ORANGE,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -sizes.SIZE_9,
  },
  labelLocation: {
    color: colors.COLOR_BLACK,
    fontSize: sizes.SIZE_10,
  },
  wrapLabelLocation: {
    backgroundColor: colors.COLOR_WHITE,
    paddingHorizontal: sizes.SIZE_10,
    paddingVertical: sizes.SIZE_5,
    borderRadius: sizes.SIZE_5,
    marginBottom: sizes.SIZE_5,
    maxWidth: sizes.SIZE_120,
    ...commonStyles.center,
  },
});
