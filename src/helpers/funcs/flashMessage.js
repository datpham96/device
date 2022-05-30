import {Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {colors} from 'styles';
import {Toast} from 'src/helpers/customs';
const flashMessage = {
  success: message => {
    if (Platform.OS === 'ios') {
      showMessage({
        icon: 'success',
        message: message,
        type: 'success',
        animated: true,
        duration: 1500,
        hideStatusBar: true,
        backgroundColor: '#16a34a',
        color: colors.COLOR_WHITE,
      });
    } else {
      Toast(message);
    }
  },
  error: message => {
    if (Platform.OS === 'ios') {
      showMessage({
        icon: 'danger',
        message: message,
        type: 'danger',
        animated: true,
        duration: 1500,
        hideStatusBar: true,
        backgroundColor: '#ef4444',
        color: colors.COLOR_WHITE,
      });
    } else {
      Toast(message);
    }
  },
};

export default flashMessage;
