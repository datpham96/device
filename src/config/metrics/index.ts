import {Dimensions, Appearance} from 'react-native';
import {
  getStatusBarHeight,
  getBottomSpace,
  isIphoneX,
} from 'react-native-iphone-x-helper';
import sizes from '../styles/sizes';
const {width, height} = Dimensions.get('window');

const metrics = {
  screenWidth: width,
  screenHeight: height,
  statusBarHeight: getStatusBarHeight(),
  bottomHeight: getBottomSpace(),
  heightInput: sizes.SIZE_44,
  heightBottomTab: isIphoneX()
    ? getBottomSpace() + sizes.SIZE_50
    : getBottomSpace() + sizes.SIZE_60,
  colorScheme: Appearance.getColorScheme(),
};

export default metrics;
