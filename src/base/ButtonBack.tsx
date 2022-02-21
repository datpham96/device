import React, {useState} from 'react';
import images from 'images';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors, commonStyles, sizes} from 'styles';
import Text from './Text';
import * as RootNavigation from 'RootNavigation';
import FastImage from 'react-native-fast-image';

export type Props = {
  label?: any;
  onPress?: any;
};

const ButtonBack: React.FC<Props> = ({label = 'Quay lại', onPress = null}) => {
  const [active, setActive] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (onPress) {
            onPress();
          } else {
            RootNavigation.goBack();
          }

          setActive(true);
        }}
        style={styles.wrapBtnBack}>
        <FastImage
          style={[
            styles.iconBack,
            active ? {tintColor: colors.COLOR_UNDERLAY_BUTTON_BACK} : {},
          ]}
          tintColor={active ? colors.COLOR_UNDERLAY_BUTTON_BACK : undefined}
          source={images.icons.nav_back}
        />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sizes.SIZE_15,
    paddingVertical: sizes.SIZE_10,
    marginTop: sizes.SIZE_10,
  },
  wrapBtnBack: {
    ...commonStyles.flexRowCenter,
    alignSelf: 'flex-start',
  },
  label: {
    marginLeft: sizes.SIZE_10,
  },
  iconBack: {
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
    resizeMode: 'contain',
  },
});

export default ButtonBack;
