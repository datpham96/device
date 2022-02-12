import {Platform, StyleSheet} from 'react-native';
import {sizes, fonts, colors, commonStyles} from 'styles';
import metrics from 'metrics';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
  },
  wrapHeader: {
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_10,
    marginTop: sizes.SIZE_15,
  },
  logoLock: {
    width: metrics.screenWidth / sizes.SIZE_3,
    height: sizes.SIZE_50,
  },
  wrapSelected: {
    ...commonStyles.flexRowCenter,
  },
  iconChevronLeft: {},
  avatarShield: {
    width: metrics.screenWidth / sizes.SIZE_10,
    height: metrics.screenWidth / sizes.SIZE_10,
    borderRadius: metrics.screenWidth / sizes.SIZE_10 / sizes.SIZE_2,
  },
  wrapAvatarDevice: {
    position: 'relative',
  },
  dotOnline: {
    width: sizes.SIZE_10,
    height: sizes.SIZE_10,
    backgroundColor: colors.COLOR_GREEN,
    borderRadius: sizes.SIZE_5,
    position: 'absolute',
  },
  titleShield: {
    marginLeft: sizes.SIZE_8,
    // width: sizes.SIZE_80,
  },
  wrapContainerTitle: {
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_10,
    marginTop: sizes.SIZE_15,
  },
  wrapTitle: {
    ...commonStyles.flexRowCenter,
  },
  bar: {
    width: sizes.SIZE_2,
    height: sizes.SIZE_12,
    backgroundColor: colors.COLOR_BLUE,
    marginTop: sizes.SIZE_2,
  },
  title: {
    fontSize: sizes.SIZE_18,
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    marginLeft: sizes.SIZE_4,
  },
  wrapSelectCalendar: {
    backgroundColor: colors.COLOR_BLUE,
    borderRadius: sizes.SIZE_20,
    paddingHorizontal: sizes.SIZE_15,
    paddingVertical: sizes.SIZE_7,
    paddingBottom: sizes.SIZE_8,
    ...commonStyles.flexRowCenter,
  },
  wrapCalendar: {
    position: 'relative',
  },
  iconWrapCalendar: {
    width: sizes.SIZE_25,
    height: sizes.SIZE_25,
    // position: 'absolute',
  },
  calendarDay: {
    position: 'absolute',
    ...Platform.select({
      android: {
        left: sizes.SIZE_6,
        top: sizes.SIZE_7,
      },
      ios: {
        top: sizes.SIZE_8,
        left: sizes.SIZE_7,
      },
    }),
    fontSize: sizes.SIZE_12,
  },
  calendarMonth: {
    marginLeft: sizes.SIZE_5,
  },
  //chart
  chartContainer: {
    // ...commonStyles.flex1,
    marginVertical: sizes.SIZE_15,
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_15,
    // marginTop: sizes.SIZE_25,
  },
  wrapParams: {
    // backgroundColor: 'green',
    width: sizes.SIZE_120,
    alignItems: 'center',
  },
  paramInfo: {
    marginBottom: sizes.SIZE_25,
  },
  paramInfoLabel: {
    color: colors.COLOR_UNDERLAY_BUTTON_BACK,
    fontSize: sizes.SIZE_16,
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    marginBottom: sizes.SIZE_10,
  },
  wrapParamInfoValue: {
    ...commonStyles.flexRowCenter,
    marginTop: sizes.SIZE_10,
  },
  paramInfoValueDot: {
    width: sizes.SIZE_15,
    height: sizes.SIZE_15,
    backgroundColor: colors.COLOR_CHART_BLUE,
    borderRadius: sizes.SIZE_15 / sizes.SIZE_2,
    borderWidth: sizes.SIZE_2,
    borderColor: colors.COLOR_WHITE,
  },
  paramInfoValue: {
    marginLeft: sizes.SIZE_10,
    fontSize: sizes.SIZE_13,
  },
  //list
  wrapHeaderList: {
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
    paddingHorizontal: sizes.SIZE_15,
    marginTop: sizes.SIZE_20,
  },
  wrapHeaderSelect: {
    ...commonStyles.flexRowCenter,
  },
  headerVerticalBar: {
    width: sizes.SIZE_2,
    height: sizes.SIZE_11,
    backgroundColor: colors.COLOR_BLUE,
  },
  headerSelect: {
    ...commonStyles.flexRowCenter,
    marginLeft: sizes.SIZE_5,
  },
  labelSelectLeft: {
    fontSize: sizes.SIZE_16,
  },
  spaceVerticalBar: {
    width: sizes.SIZE_1,
    height: sizes.SIZE_11,
    backgroundColor: colors.COLOR_WHITE,
    marginHorizontal: sizes.SIZE_10,
  },
  labelSelectRight: {
    fontSize: sizes.SIZE_16,
  },
  wrapFilter: {
    ...commonStyles.flexRowCenter,
  },
  labelFilter: {
    color: colors.COLOR_BLUE,
  },
  iconFilter: {
    width: sizes.SIZE_15,
    height: sizes.SIZE_15,
    tintColor: colors.COLOR_BLUE,
    marginLeft: sizes.SIZE_8,
  },
  //flatlist
  placeholderContainer: {
    paddingHorizontal: sizes.SIZE_10,
    marginTop: sizes.SIZE_15,
  },
  wrapItemPlaceholder: {
    marginBottom: sizes.SIZE_15,
  },
  flatList: {
    marginTop: sizes.SIZE_10,
    paddingHorizontal: sizes.SIZE_15,
    // ...commonStyles.flex1,
    height: metrics.statusBarHeight / 1.8,
  },
  datePicker: {
    width: sizes.ZERO,
    height: sizes.ZERO,
  },
  btnNowConnect: {
    alignSelf: 'auto',
  },
});

export default styles;
