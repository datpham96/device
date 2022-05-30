import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
//node_modules
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//api
//base
import {Text, Input, Button} from 'base';
//components
import {
  TextError,
  InputDateComponent,
  InputSelectComponent,
  ModalCameraBottomSheet,
} from 'components';
//config
import images from 'images';
import {colors, commonStyles, sizes} from 'styles';
import metrics from 'metrics';
//helpers
//HOC
//hooks
import {useToggleAnimationModal} from 'hooks';
//navigation
//storages
//redux-stores
//feature
import {genders} from 'types';
//code-splitting
//screen

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
  genderValue = 1,
  errors,
  setDataRequestAvatar,
  setAvatarUri,
  avatarUri,
  onRequestCloseModal,
}) => {
  const [visibleImagePicker, setVisibleImagePicker] = useState(false);
  const [visibleModal, scaleAni] = useToggleAnimationModal(visible);

  const handleOpenBottomSheetImagePicker = () => {
    setVisibleImagePicker(true);
  };

  return (
    <Modal
      onRequestClose={onRequestCloseModal}
      animationType="none"
      transparent={true}
      visible={visibleModal}>
      {visibleImagePicker && (
        <ModalCameraBottomSheet
          setDataRequestAvatar={data => setDataRequestAvatar(data)}
          setAvatarUri={data => setAvatarUri(data)}
          onPressCancel={() => setVisibleImagePicker(false)}
          visible={visibleImagePicker}
          onPressClose={() => setVisibleImagePicker(false)}
        />
      )}
      <View style={styles.backgroundModal} />
      <KeyboardAwareScrollView style={commonStyles.flex1}>
        <Animated.View
          style={[styles.container, {transform: [{scale: scaleAni}]}]}>
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
                    listData={genders}
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
        </Animated.View>
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
    borderWidth: sizes.SIZE_2,
    borderColor: colors.COLOR_WHITE,
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
