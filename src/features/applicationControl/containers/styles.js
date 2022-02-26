import {StyleSheet} from 'react-native';
import {colors, commonStyles, sizes} from 'styles';

export default StyleSheet.create({
  container: {
    ...commonStyles.flex1,
    marginTop: sizes.SIZE_20,
  },
  headerContainer: {
    ...commonStyles.flexRowCenter,
    paddingHorizontal: sizes.SIZE_10,
  },
  iconNavBack: {
    width: sizes.SIZE_35,
    height: sizes.SIZE_35,
    marginRight: sizes.SIZE_10,
  },
  wrapHeaderInput: {
    ...commonStyles.flex1,
  },
  iconHeaderPlus: {
    width: sizes.SIZE_40,
    height: sizes.SIZE_40,
    marginLeft: sizes.SIZE_5,
  },
  mainTitleStyle: {
    paddingHorizontal: sizes.SIZE_20,
    marginTop: sizes.SIZE_30,
  },
  wrapTableHeader: {
    borderTopWidth: sizes.SIZE_2,
    borderTopColor: colors.COLOR_WHITE,
    borderBottomWidth: sizes.SIZE_2,
    borderBottomColor: colors.COLOR_WHITE,
    flexDirection: 'row',
    paddingHorizontal: sizes.SIZE_10,
    paddingVertical: sizes.SIZE_10,
    marginTop: sizes.SIZE_20,
  },
  loadingContainer: {
    padding: sizes.SIZE_10,
  },
  headerTableTitleOne: {
    ...commonStyles.flex1,
  },
  headerTableTitleTwo: {
    width: sizes.SIZE_100,
  },
  headerTableTitleThree: {
    width: sizes.SIZE_100,
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
});
