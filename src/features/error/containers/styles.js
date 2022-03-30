import metrics from 'metrics';
import {StyleSheet} from 'react-native';
import {commonStyles, fonts, sizes} from 'styles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
    ...commonStyles.center,
  },
  image: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
  },
  content: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '31%',
    fontFamily: fonts.lexendDeca.FONT_MEDIUM,
    fontSize: sizes.SIZE_16,
    textAlign: 'center',
    lineHeight: sizes.SIZE_23,
  },
  btn: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '20%',
  },
  wrapLottie: {
    width: wp('70%'),
    height: wp('70%'),
    position: 'absolute',
    bottom: '40%',
  },
  wrapLottie401: {
    width: wp('155%'),
    height: wp('150%'),
    alignSelf: 'center',
  },
});

export default styles;
