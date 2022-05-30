import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
//node_modules
//api
//base
import {Text} from 'base';
//components
//config
import {colors, sizes, commonStyles, fonts} from 'styles';
//helpers
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
//code-splitting
//screen

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
    <View>
      <View style={styles.triangleMarker} />
      <ScrollView
        contentContainerStyle={[
          styles.contentScroll,
          data?.length > 10 ? {paddingBottom: sizes.SIZE_15} : {},
        ]}
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
        {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 5, 6, 7, 8, 9].map(() => {
          return (
            <TouchableOpacity activeOpacity={0.9} style={styles.wrapItem}>
              <View style={[styles.selectedItemCircle]} />
              <Text
                props={{
                  numberOfLines: sizes.SIZE_1,
                }}
                style={styles.selectedItemLabel}>
                pham tien dat
              </Text>
            </TouchableOpacity>
          );
        })} */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  triangleMarker: {
    width: sizes.ZERO,
    height: sizes.ZERO,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: sizes.ZERO,
    borderRightWidth: sizes.SIZE_8,
    borderBottomWidth: sizes.SIZE_8,
    borderLeftWidth: sizes.SIZE_8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.COLOR_WHITE,
    borderLeftColor: 'transparent',
    position: 'absolute',
    zIndex: 0,
    left: sizes.SIZE_25,
    // top: -10,
  },
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
    top: sizes.SIZE_8,
    maxHeight: 300,
  },
  wrapItem: {
    ...commonStyles.flexRowCenter,
    marginBottom: sizes.SIZE_3,
  },
  selectedItemCircle: {
    width: sizes.SIZE_10,
    height: sizes.SIZE_10,
    borderRadius: sizes.SIZE_5,
    borderWidth: sizes.SIZE_1,
    borderColor: colors.COLOR_BLACK,
    marginTop: sizes.SIZE_2,
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
