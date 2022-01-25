import {StyleSheet} from 'react-native';
import {sizes, commonStyles, colors} from 'styles';
import metrics from 'metrics';

export default StyleSheet.create({
  contentContainer: {
    paddingHorizontal: sizes.SIZE_30,
    ...commonStyles.center,
    flex: 0.8,
  },
  logo: {
    width: metrics.screenWidth / sizes.SIZE_5,
    height: metrics.screenWidth / sizes.SIZE_5,
    alignSelf: 'center',
  },
  mainTitle: {
    marginVertical: sizes.SIZE_40,
    textAlign: 'center',
  },
  mainTitleError: {
    marginVertical: sizes.SIZE_40,
    textAlign: 'center',
    color: colors.COLOR_RED_ORANGE,
  },
  btn: {
    alignSelf: 'center',
    marginTop: sizes.SIZE_30,
  },
  content: {
    fontSize: sizes.SIZE_20,
    textAlign: 'center',
  },
});
