import React from 'react';
import {StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import metrics from 'metrics';
import {commonStyles, sizes, colors} from 'styles';

const ItemListPlaceholder = () => {
  return (
    <View style={[commonStyles.flexRowCenter, styles.container]}>
      <SkeletonPlaceholder backgroundColor={colors.COLOR_LOADING_PLACEHOLDER}>
        <View style={styles.sectionOne}>
          <View style={styles.avatar} />
          <View style={styles.wrapInfo}>
            <View>
              <View style={styles.name} />
              <View style={styles.domain} />
            </View>
          </View>
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder backgroundColor={colors.COLOR_LOADING_PLACEHOLDER}>
        <View style={styles.wrapDetail}>
          <View style={styles.detail} />
        </View>
      </SkeletonPlaceholder>
      <View style={styles.wrapSwitch}>
        <SkeletonPlaceholder backgroundColor={colors.COLOR_LOADING_PLACEHOLDER}>
          <View style={styles.borderSwitch} />
        </SkeletonPlaceholder>
        <View style={styles.wrapInsideSwitch}>
          <View style={styles.backgroundSwitch} />
          <View style={styles.circleSwitch} />
        </View>
      </View>
    </View>
  );
};

const SIZE_WIDTH_SECTION_ONE =
  metrics.screenWidth - sizes.SIZE_20 - sizes.SIZE_100 * 2;
const SIZE_AVATAR = metrics.screenWidth / sizes.SIZE_8;

const styles = StyleSheet.create({
  container: {
    marginBottom: sizes.SIZE_10,
  },
  sectionOne: {
    flexDirection: 'row',
    width: SIZE_WIDTH_SECTION_ONE,
  },
  avatar: {
    width: SIZE_AVATAR,
    height: SIZE_AVATAR,
    borderRadius: metrics.screenWidth / sizes.SIZE_16,
  },
  wrapInfo: {
    marginLeft: sizes.SIZE_10,
    ...commonStyles.flex1,
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
  },
  name: {
    width: SIZE_WIDTH_SECTION_ONE - SIZE_AVATAR - sizes.SIZE_20,
    height: sizes.SIZE_12,
    borderRadius: sizes.SIZE_4,
  },
  domain: {
    width: (SIZE_WIDTH_SECTION_ONE - SIZE_AVATAR - sizes.SIZE_20) * 0.8,
    height: sizes.SIZE_12,
    borderRadius: sizes.SIZE_4,
    marginTop: sizes.SIZE_5,
  },
  wrapDetail: {
    width: sizes.SIZE_100,
  },
  detail: {
    width: sizes.SIZE_100 * 0.8,
    height: sizes.SIZE_14,
    borderRadius: sizes.SIZE_4,
  },
  wrapSwitch: {
    width: sizes.SIZE_100,
    alignItems: 'flex-end',
  },
  borderSwitch: {
    width: sizes.SIZE_100 * 0.4,
    height: sizes.SIZE_22,
    borderRadius: sizes.SIZE_12,
  },
  wrapInsideSwitch: {
    position: 'absolute',
  },
  backgroundSwitch: {
    width: sizes.SIZE_100 * 0.34,
    height: sizes.SIZE_16,
    borderRadius: sizes.SIZE_12,
    backgroundColor: colors.COLOR_UNDERLAY_BUTTON_BLACK,

    top: sizes.SIZE_3,
    right: sizes.SIZE_3,
  },
  circleSwitch: {
    width: sizes.SIZE_14,
    height: sizes.SIZE_14,
    borderRadius: sizes.SIZE_7,
    backgroundColor: colors.COLOR_DARK_SEPERATOR,
    position: 'absolute',
    right: sizes.SIZE_5,
    top: sizes.SIZE_4,
  },
});

export default ItemListPlaceholder;
