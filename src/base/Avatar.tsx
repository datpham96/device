/* eslint-disable indent */
import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import metrics from '../config/metrics';
import {colors, commonStyles, sizes} from 'styles';
import images from 'images';

export type Props = {
  uriImage?: any;
  containerStyle?: any;
  imageStyle?: any;
  isWeb?: boolean;
};

const Avatar: React.FC<Props> = ({
  uriImage = null,
  containerStyle,
  imageStyle,
  isWeb,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  let tmpSrcImage = {
    uri: uriImage,
    priority: FastImage.priority.normal,
  };

  const [uri, setUri] = useState(
    uriImage
      ? tmpSrcImage
      : isWeb
      ? images.icons.web_default
      : images.avatars.picture_default,
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {isLoading && (
        <View style={styles.wrapActivityIndicator}>
          <ActivityIndicator color={colors.COLOR_WHITE} />
        </View>
      )}
      <FastImage
        onLoadStart={() => setIsLoading(true)}
        onError={() => {
          setIsLoading(false);
          setUri(
            isWeb ? images.icons.web_default : images.avatars.picture_default,
          );
        }}
        onLoadEnd={() => setIsLoading(false)}
        style={[styles.image, imageStyle]}
        // source={
        //   uriImage
        //     ? tmpSrcImage
        //     : isWeb
        //     ? images.icons.web_default
        //     : images.avatars.picture_default
        // }
        source={uri}
        // resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapActivityIndicator: {
    width: '100%',
    height: '100%',
    ...commonStyles.center,
    position: 'absolute',
  },
  container: {
    width: metrics.screenWidth / sizes.SIZE_4,
    height: metrics.screenWidth / sizes.SIZE_4,
    borderRadius: metrics.screenWidth / sizes.SIZE_8,
  },
  image: {
    width: metrics.screenWidth / sizes.SIZE_4,
    height: metrics.screenWidth / sizes.SIZE_4,
    borderRadius: metrics.screenWidth / sizes.SIZE_8,
    borderWidth: sizes.SIZE_4,
    borderColor: colors.COLOR_WHITE,
  },
});

export default Avatar;
