import React, {useState} from 'react';
import {View, TouchableHighlight, StyleSheet} from 'react-native';
import {Text, Switch} from 'base';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {commonStyles, sizes, fonts} from 'styles';

const TIME_DEFAULT = '00/00';

const ItemTimeUseComponent = ({
  day,
  startTime = TIME_DEFAULT,
  endTime = TIME_DEFAULT,
  onChangeSwitch,
  status,
  containerStyle,
  onPress,
}) => {
  const [toggleSwitch, setToggleSwitch] = useState(status ? true : false);
  return (
    <TouchableHighlight
      underlayColor="rgba(90, 142, 209, 0.5)"
      onPress={onPress}
      style={[styles.wrapItem, containerStyle]}>
      <>
        <View style={styles.wrapItemTime}>
          <Text style={styles.itemStartTime}>
            {startTime ? startTime : TIME_DEFAULT}
          </Text>
          <Text style={styles.itemEndTime}>
            {endTime ? endTime : TIME_DEFAULT}
          </Text>
        </View>
        <Text style={styles.itemDay}>{day}</Text>
        <View style={styles.wrapSectionRight}>
          <Switch
            onValueChange={() => {
              onChangeSwitch(!toggleSwitch);
              setToggleSwitch(!toggleSwitch);
            }}
            value={toggleSwitch}
            containerStyle={styles.switch}
          />
        </View>
        <FastImage style={styles.itemIconEdit} source={images.icons.edit} />
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  wrapItem: {
    // backgroundColor: 'red',
    ...commonStyles.flexRowCenter,
    paddingHorizontal: sizes.SIZE_15,
    paddingVertical: sizes.SIZE_12,
    marginBottom: sizes.SIZE_10,
    borderRadius: sizes.SIZE_10,
  },
  wrapItemTime: {
    width: sizes.SIZE_60,
  },
  itemStartTime: {
    fontFamily: fonts.montserrat.FONT_REGULAR,
    fontSize: sizes.SIZE_16,
  },
  itemEndTime: {
    fontFamily: fonts.montserrat.FONT_REGULAR,
    fontSize: sizes.SIZE_12,
  },
  itemDay: {
    fontFamily: fonts.montserrat.FONT_REGULAR,
    fontSize: sizes.SIZE_16,
    marginHorizontal: sizes.SIZE_15,
    // ...commonStyles.flex1,
    paddingLeft: sizes.SIZE_15,
    width: sizes.SIZE_70,
  },
  wrapSectionRight: {
    ...commonStyles.flex1,
  },
  switch: {
    alignSelf: 'center',
  },
  wrapEdit: {
    backgroundColor: 'red',
    height: '100%',
    width: sizes.SIZE_40,
  },
  itemIconEdit: {
    width: sizes.SIZE_22,
    height: sizes.SIZE_22,
  },
});

export default ItemTimeUseComponent;
