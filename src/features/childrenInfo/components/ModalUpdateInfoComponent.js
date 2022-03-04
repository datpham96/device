import React, {useState} from 'react';
import {Text, Input, Button} from 'base';
import {View, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import images from 'images';
import FastImage from 'react-native-fast-image';
import {colors, commonStyles, sizes} from 'styles';
import metrics from 'metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextError, InputDateComponent, InputSelectComponent} from 'components';
import {ModalBottomSheet} from 'components';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

const options = {
  mediaType: 'photo',
  title: 'Chọn ảnh đại diện..',
  cancelButtonTitle: 'Hủy bỏ',
  takePhotoButtonTitle: 'Chụp ảnh',
  quality: 0.1,
  chooseFromLibraryButtonTitle: 'Chọn từ thư viện',
  includeBase64: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const ModalUpdateInfoComponent = ({
  visible = false,
  onPressClose,
  onPressSubmit,
  nameValue,
  onChangeName,
  deviceNameValue,
  birthdayValue,
  onChangeBirthday,
  onChangeGender,
  genderValue,
  errors,
  setDataRequestAvatar,
  setAvatarUri,
  avatarUri,
}) => {
  const [visibleImagePicker, setVisibleImagePicker] = useState(false);
  const handleOpenCamera = () => {
    setVisibleImagePicker(false);
    setTimeout(() => {
      options.mediaType = 'photo';
      launchCamera(options, response => {
        if (response && response?.assets) {
          let item = response.assets?.[0];
          let formatData = 'data:' + item.type + ';base64,' + item.base64;
          setDataRequestAvatar(formatData);
          setAvatarUri({uri: item.uri});
        }
      });
    }, 100);
  };

  const handleOpenLibrary = () => {
    setVisibleImagePicker(false);
    setTimeout(() => {
      options.mediaType = 'photo';
      launchImageLibrary(options, response => {
        if (response && response?.assets) {
          let item = response.assets?.[0];
          let formatData = 'data:' + item.type + ';base64,' + item.base64;
          setDataRequestAvatar(formatData);
          setAvatarUri({uri: item.uri});
        }
      });
    }, 100);
  };
  const handleOpenBottomSheetImagePicker = () => {
    setVisibleImagePicker(true);
  };
  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <ModalBottomSheet
        onPressOne={handleOpenCamera}
        onPressTwo={handleOpenLibrary}
        onPressCancel={() => setVisibleImagePicker(false)}
        visible={visibleImagePicker}
        onPressClose={() => setVisibleImagePicker(false)}
      />
      <View style={styles.backgroundModal} />
      <KeyboardAwareScrollView style={commonStyles.flex1}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.wrapIconClose}
              activeOpacity={0.8}
              onPress={onPressClose}>
              <FastImage style={styles.iconClose} source={images.icons.close} />
            </TouchableOpacity>
            <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
              Cập nhật thông tin
            </Text>
            <View>
              <TouchableOpacity
                onPress={handleOpenBottomSheetImagePicker}
                activeOpacity={0.9}
                style={styles.wrapSelectAvatar}>
                {avatarUri?.uri ? (
                  <FastImage style={styles.avatar} source={avatarUri} />
                ) : (
                  <FastImage
                    style={styles.iconAvatar}
                    source={images.icons.select_avatar}
                  />
                )}
              </TouchableOpacity>
              <View style={styles.wrapInput}>
                <Input
                  value={nameValue}
                  onChangeValue={val => onChangeName(val)}
                  placeholder="Họ và tên trẻ"
                />
                {errors?.fullName && <TextError message={errors?.fullName} />}
              </View>
              <View style={styles.wrapInput}>
                <Input
                  value={deviceNameValue}
                  customerInput={{backgroundColor: colors.COLOR_DISABLE}}
                  containerInput={{backgroundColor: colors.COLOR_DISABLE}}
                  props={{editable: false}}
                  placeholder="Tên thiết bị"
                />
              </View>
              <View style={styles.wrapInputDateGender}>
                <View style={styles.wrapInputDate}>
                  <InputDateComponent
                    value={birthdayValue}
                    onDateChange={date => onChangeBirthday(date)}
                  />
                  {errors?.birthday && <TextError message={errors?.birthday} />}
                </View>
                <View style={styles.wrapInputGender}>
                  <InputSelectComponent
                    selectedValue={genderValue}
                    onDonePress={val => onChangeGender(val)}
                    placeholder="--Giới tính--"
                    listData={[
                      {label: 'Nam', value: 1},
                      {label: 'Nữ', value: 2},
                    ]}
                  />
                  {errors?.gender && <TextError message={errors?.gender} />}
                </View>
              </View>
              <Button
                customStyle={styles.btn}
                label="Cập nhật"
                onPress={onPressSubmit}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const sizeImage = metrics.screenWidth / sizes.SIZE_5;
const iconImage = sizeImage / 2.5;

const styles = StyleSheet.create({
  modalContainer: {
    ...commonStyles.center,
  },
  backgroundModal: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    backgroundColor: colors.COLOR_BLACK,
    position: 'absolute',
    opacity: 0.5,
    zIndex: 0,
  },
  iconClose: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
  },
  wrapIconClose: {
    alignSelf: 'flex-end',
  },
  container: {
    ...commonStyles.flex1,
    ...commonStyles.center,
    height: metrics.screenHeight,
  },
  contentContainer: {
    backgroundColor: colors.COLOR_DARK_BLUE,
    width: metrics.screenWidth - sizes.SIZE_30,
    borderRadius: sizes.SIZE_15,
    padding: sizes.SIZE_15,
    paddingBottom: sizes.SIZE_100,
  },
  mainTitle: {},
  //content
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

export default ModalUpdateInfoComponent;
