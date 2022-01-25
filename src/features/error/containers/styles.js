import metrics from 'metrics';
import {StyleSheet} from 'react-native';
import {commonStyles} from 'styles';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
  },
  image: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
  },
  btn: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '25%',
  },
});

export default styles;
