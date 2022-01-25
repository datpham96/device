import {Dimensions} from 'react-native';
import {getStatusBarHeight, getBottomSpace} from 'react-native-iphone-x-helper';
import sizes from '../styles/sizes';
const {width, height} = Dimensions.get('screen');

const metrics = {
  screenWidth: width,
  screenHeight: height,
  statusBarHeight: getStatusBarHeight(),
  bottomHeight: getBottomSpace(),
  heightInput: sizes.SIZE_44,
  heightBottomTab: getBottomSpace() + 50,
};

export default metrics;
