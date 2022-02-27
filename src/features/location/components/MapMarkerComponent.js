import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {colors, sizes, commonStyles} from 'styles';
import images from 'images';
import {Text} from 'base';
import FastImage from 'react-native-fast-image';

const MapMarker = ({markers, handleMaker}) => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={markers}
      tracksViewChanges={false}
      onPress={handleMaker}>
      <Marker
        pinColor={colors.COLOR_RED_ORANGE}
        coordinate={markers}
        tappable={false}>
        {markers?.latitude > 0 && markers?.longitude > 0 && (
          <>
            {markers?.address && (
              <View style={styles.wrapLabelLocation}>
                <Text style={styles.labelLocation}>{markers?.address}</Text>
              </View>
            )}
            <View style={styles.wrapImageMarkers}>
              <FastImage
                style={styles.imageMarker}
                source={
                  markers?.avatar
                    ? {uri: markers.avatar, priority: FastImage.priority.low}
                    : images.avatars.default
                }
              />
              <View style={styles.triangleMarker} />
            </View>
          </>
        )}
      </Marker>
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapLabelLocation: {
    backgroundColor: colors.COLOR_WHITE,
    paddingHorizontal: sizes.SIZE_10,
    paddingVertical: sizes.SIZE_5,
    borderRadius: sizes.SIZE_5,
    marginBottom: sizes.SIZE_5,
    maxWidth: sizes.SIZE_120,
    ...commonStyles.center,
  },
  labelLocation: {
    color: colors.COLOR_BLACK,
    fontSize: sizes.SIZE_10,
  },
  wrapImageMarkers: {
    position: 'relative',
    alignSelf: 'center',
  },
  imageMarker: {
    width: sizes.SIZE_25,
    height: sizes.SIZE_25,
    borderRadius: sizes.SIZE_25 / sizes.SIZE_2,
    borderColor: colors.COLOR_RED_ORANGE,
    borderWidth: sizes.SIZE_1,
    zIndex: sizes.SIZE_1,
  },
  triangleMarker: {
    width: sizes.ZERO,
    height: sizes.ZERO,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: sizes.SIZE_20,
    borderRightWidth: sizes.SIZE_25 / sizes.SIZE_2,
    borderBottomWidth: sizes.ZERO,
    borderLeftWidth: sizes.SIZE_25 / sizes.SIZE_2,
    borderTopColor: colors.COLOR_RED_ORANGE,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -sizes.SIZE_9,
    zIndex: 0,
  },
});

export default React.memo(MapMarker);