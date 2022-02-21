import React from 'react';
import {Text, Button} from 'base';
import {View, StyleSheet, Modal} from 'react-native';
import images from 'images';
import FastImage from 'react-native-fast-image';
import {colors, commonStyles, sizes} from 'styles';
import metrics from 'metrics';

export type Props = {
  visible?: any;
  onPressCancel?: any;
  onPressAgree?: any;
  content?: any;
  labelBtnLeft?: any;
  labelBtnRight?: any;
};

const PopupConfirmComponent: React.FC<Props> = ({
  visible = false,
  onPressCancel,
  onPressAgree,
  content,
  labelBtnLeft = 'Có',
  labelBtnRight = 'Không',
}) => {
  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <View style={styles.backgroundModal} />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={styles.logoSuccess}
            source={images.logos.success}
          />
          <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
            Thông báo
          </Text>
          <Text style={styles.content}>{content}</Text>
          <View style={styles.wrapBtn}>
            <Button
              customStyle={styles.btn}
              onPress={onPressAgree}
              label={labelBtnLeft}
            />
            <Button
              customStyle={styles.btn}
              onPress={onPressCancel}
              label={labelBtnRight}
            />
          </View>
        </View>
      </View>
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
    lineHeight: sizes.SIZE_22,
  },
  wrapBtn: {
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-around',
    marginTop: sizes.SIZE_30,
  },
  btn: {
    width: '45%',
    alignSelf: 'auto',
  },
  label: {},
});

export default PopupConfirmComponent;
