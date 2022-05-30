import React from 'react';
import {View, StyleSheet, Modal, Animated} from 'react-native';
//node_modules
import FastImage from 'react-native-fast-image';
//api
//base
import {Button, Text} from 'base';
//components
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
//code-splitting
//screen
export type Props = {
  visible?: any;
  onPressCancel?: any;
  content?: any;
  srcImage?: any;
};

const PopupAlertComponent: React.FC<Props> = ({
  visible = false,
  onPressCancel,
  content,
  srcImage = images.logos.success,
}) => {
  const [visibleModal, scaleAni] = useToggleAnimationModal(visible);
  return (
    <Modal
      onRequestClose={onPressCancel}
      animationType="none"
      transparent={true}
      visible={visibleModal}>
      <View style={styles.backgroundModal} />
      <Animated.View
        style={[styles.container, {transform: [{scale: scaleAni}]}]}>
        <View style={styles.contentContainer}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={styles.logoSuccess}
            source={srcImage}
          />
          <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
            Thông báo
          </Text>
          <Text style={styles.content}>{content}</Text>
          <View style={styles.wrapBtn}>
            <Button
              customStyle={styles.btn}
              onPress={() => onPressCancel()}
              label="Đóng"
            />
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backgroundModal: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    backgroundColor: colors.COLOR_BLACK,
    position: 'absolute',
    opacity: 0.5,
    zIndex: 0,
  },
  container: {
    ...commonStyles.flex1,
    ...commonStyles.center,
  },
  contentContainer: {
    backgroundColor: colors.COLOR_DARK_BLUE,
    width: metrics.screenWidth - sizes.SIZE_30,
    borderRadius: sizes.SIZE_15,
    padding: sizes.SIZE_15,
    paddingBottom: sizes.SIZE_50,
    paddingTop: sizes.SIZE_50,
  },
  logoSuccess: {
    width: metrics.screenWidth / sizes.SIZE_8,
    height: metrics.screenWidth / sizes.SIZE_8,
    alignSelf: 'center',
  },
  mainTitle: {
    fontSize: sizes.SIZE_20,
    textAlign: 'center',
    marginTop: sizes.SIZE_15,
  },
  content: {
    textAlign: 'center',
    marginTop: sizes.SIZE_20,
  },
  wrapBtn: {
    ...commonStyles.center,
    marginTop: sizes.SIZE_30,
  },
  btn: {
    alignSelf: 'center',
  },
});

export default PopupAlertComponent;
