import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'base';
import {colors, sizes, commonStyles, fonts} from 'styles';

export type Props = {
  data?: any;
  onPressItem?: any;
  selected?: any;
  containerStyle?: any;
};

const SelectedComponent: React.FC<Props> = ({
  data = [],
  onPressItem,
  selected,
  containerStyle,
}) => {
  return (
    <ScrollView
      contentContainerStyle={[styles.contentScroll]}
      style={[styles.containerScroll, containerStyle]}>
      {data.map((item?: any, key?: any) => {
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPressItem(item)}
            key={key}
            style={styles.wrapItem}>
            <View
              style={[
                styles.selectedItemCircle,
                selected === item.value
                  ? {backgroundColor: colors.COLOR_BLACK}
                  : {},
              ]}
            />
            <Text
              props={{
                numberOfLines: sizes.SIZE_1,
              }}
              style={styles.selectedItemLabel}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentScroll: {
    // paddingBottom: sizes.SIZE_15,
  },
  containerScroll: {
    backgroundColor: colors.COLOR_WHITE,
    borderRadius: sizes.SIZE_10,
    padding: sizes.SIZE_10,
    width: '100%',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: sizes.SIZE_25,
    maxHeight: sizes.SIZE_90,
  },
  wrapItem: {
    ...commonStyles.flexRowCenter,
  },
  selectedItemCircle: {
    width: sizes.SIZE_10,
    height: sizes.SIZE_10,
    borderRadius: sizes.SIZE_5,
    borderWidth: sizes.SIZE_1,
    borderColor: colors.COLOR_BLACK,
  },
  selectedItemLabel: {
    color: colors.COLOR_BLACK,
    marginLeft: sizes.SIZE_5,
    fontFamily: fonts.montserrat.FONT_REGULAR,
    lineHeight: sizes.SIZE_25,
    marginRight: sizes.SIZE_5,
  },
});

export default SelectedComponent;
