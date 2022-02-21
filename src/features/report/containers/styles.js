import {StyleSheet} from 'react-native';
import {colors, commonStyles, sizes} from 'styles';

export default StyleSheet.create({
  container: {
    ...commonStyles.flex1,
    marginTop: sizes.SIZE_20,
  },
  headerContainer: {
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_15,
  },
  wrapBtnSelectDate: {
    backgroundColor: colors.COLOR_WHITE,
    borderRadius: sizes.SIZE_10,
  },
  wrapContentBtnSelectDate: {
    ...commonStyles.flexRowCenter,
    paddingHorizontal: sizes.SIZE_20,
    paddingVertical: sizes.SIZE_8,
  },
  iconDate: {
    width: sizes.SIZE_20,
    height: sizes.SIZE_20,
  },
  textDate: {
    color: colors.COLOR_BLACK,
    marginLeft: sizes.SIZE_10,
  },
  mainTitleStyle: {},
  wrapTableHeader: {
    // borderTopWidth: sizes.SIZE_2,
    // borderTopColor: colors.COLOR_WHITE,
    // borderBottomWidth: sizes.SIZE_2,
    // borderBottomColor: colors.COLOR_WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_10,
    paddingVertical: sizes.SIZE_10,
    marginTop: sizes.SIZE_20,
  },
  wrapTabsHeader: {
    flexDirection: 'row',
  },
  leftDash: {
    backgroundColor: colors.COLOR_BLUE,
    width: sizes.SIZE_2,
    height: '70%',
    alignSelf: 'center',
  },
  containerTab: {
    flexDirection: 'row',
    marginLeft: sizes.SIZE_5,
  },
  spaceTab: {
    height: '70%',
    width: sizes.SIZE_2,
    backgroundColor: colors.COLOR_WHITE,
    alignSelf: 'center',
    marginHorizontal: sizes.SIZE_8,
  },
  headerTableTitleOne: {
    fontSize: sizes.SIZE_16,
    // ...commonStyles.flex1,
  },
  headerTableTitleThree: {
    width: sizes.SIZE_130,
    textAlign: 'right',
  },
  contentContainerFlatlist: {
    paddingHorizontal: sizes.SIZE_10,
    paddingVertical: sizes.SIZE_15,
    flexGrow: 1,
  },
  flatList: {
    ...commonStyles.flex1,
  },
  datePicker: {
    width: sizes.ZERO,
    height: sizes.ZERO,
  },
});
