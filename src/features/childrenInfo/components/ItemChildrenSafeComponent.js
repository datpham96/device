import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'base';
import FastImage from 'react-native-fast-image';
import images from 'images';
import Switch from './SwitchComponent';
import {commonStyles, sizes} from 'styles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const ItemChildrenSafeComponent = ({
  srcImage = images.icons.safe_web,
  toggleSwitch,
  value = 1,
  content,
  pointerEvents = 'auto',
  containerStyle,
}) => {
  return (
    <View
      pointerEvents={pointerEvents}
      style={[styles.container, containerStyle]}>
      <FastImage style={styles.image} source={srcImage} />
      <Text style={styles.content}>{content}</Text>
      <Switch
        containerStyle={styles.switch}
        onValueChange={toggleSwitch}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flexRowCenter,
    paddingVertical: sizes.SIZE_10,
  },
  image: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('9%'),
  },
  content: {
    ...commonStyles.flex1,
    marginHorizontal: sizes.SIZE_10,
    fontSize: sizes.SIZE_12,
  },
  switch: {
    marginTop: sizes.SIZE_3,
    alignSelf: 'center',
  },
});

export default ItemChildrenSafeComponent;
