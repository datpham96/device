import {StyleSheet} from 'react-native';
import {commonStyles, sizes, colors, fonts} from 'styles';

export default StyleSheet.create({
  container: {
    paddingHorizontal: sizes.SIZE_15,
    marginTop: sizes.SIZE_30,
    ...commonStyles.flex1,
  },
  wrapMainTitle: {
    ...commonStyles.flexRowCenter,
  },
  mainTitle: {
    marginLeft: sizes.SIZE_15,
  },
  wrapContent: {
    marginTop: sizes.SIZE_30,
  },
  wrapInfo: {
    ...commonStyles.flexRowCenter,
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
  iconChevronRight: {
    marginRight: -sizes.SIZE_10,
  },
  lineOne: {
    marginVertical: sizes.SIZE_20,
  },
  wrapSafeWeb: {
    // ...commonStyles.flexRowCenter,
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
});
