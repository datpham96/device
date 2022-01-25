import {StyleSheet} from 'react-native';
import {sizes, commonStyles, colors} from 'styles';
import metrics from 'metrics';

const sizeImage = metrics.screenWidth / sizes.SIZE_5;
const iconImage = sizeImage / 2.5;

export default StyleSheet.create({
  container: {
    paddingHorizontal: sizes.SIZE_20,
    marginTop: sizes.SIZE_30,
  },
  mainTitleStyle: {},
  wrapSelectAvatar: {
    width: sizeImage,
    height: sizeImage,
    backgroundColor: colors.COLOR_WHITE,
    ...commonStyles.center,
    borderRadius: sizeImage / sizes.SIZE_2,
    alignSelf: 'center',
    marginVertical: sizes.SIZE_40,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: sizeImage / sizes.SIZE_2,
  },
  iconAvatar: {
    width: iconImage,
    height: iconImage,
  },
  wrapInput: {
    marginBottom: sizes.SIZE_25,
  },
  wrapInputDateGender: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapInputDate: {
    width: '48%',
  },
  wrapInputGender: {
    width: '48%',
  },
  btn: {
    alignSelf: 'center',
    marginTop: sizes.SIZE_40,
  },
});
