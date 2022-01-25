import {StyleSheet} from 'react-native';
import {sizes, commonStyles, colors} from 'styles';

export default StyleSheet.create({
  container: {
    paddingHorizontal: sizes.SIZE_15,
    marginTop: sizes.SIZE_30,
    ...commonStyles.flex1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapBtnQrCode: {
    backgroundColor: colors.COLOR_WHITE,
    alignSelf: 'baseline',
    flexDirection: 'row',
    paddingHorizontal: sizes.SIZE_8,
    paddingVertical: sizes.SIZE_7,
    borderRadius: sizes.SIZE_8,
    alignItems: 'center',
  },
  iconQrCode: {
    width: sizes.SIZE_23,
    height: sizes.SIZE_23,
  },
  labelQrCode: {
    color: colors.COLOR_BLACK,
    marginLeft: sizes.SIZE_5,
  },
  flatListStyle: {
    marginTop: sizes.SIZE_30,
  },
});
