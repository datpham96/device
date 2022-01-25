import Toast from 'react-native-simple-toast';

const MyToast = (
  message,
  duration = Toast.SHORT,
  position = Toast.CENTER,
  host = ['RCTModalHostViewController'],
) => {
  return Toast.showWithGravity(message, duration, position, host);
};

export default MyToast;
