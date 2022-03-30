/* eslint-disable indent */
import React, {useRef, useEffect, useState, useMemo} from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import {colors, sizes, commonStyles} from 'styles';
import images from 'images';
import {Text} from 'base';
import FastImage from 'react-native-fast-image';
import MapboxGL from '@react-native-mapbox-gl/maps';
import env from '../../../environment';

MapboxGL.setAccessToken(env.maps_box.accessToken);

const MapMarker = ({markers, is_block, refresh_location}) => {
  const cameraRef = useRef(null);
  const [totalLines, setTotalLines] = useState(0);

  useEffect(() => {
    if (cameraRef.current && refresh_location > 0) {
      cameraRef.current.moveTo([markers?.longitude, markers?.latitude], 500);
    }
  }, [refresh_location, markers]);

  //set box address for android
  const vectorY = useMemo(() => {
    let tmpVectorY = 0;

    if (totalLines) {
      switch (totalLines) {
        case 1:
          tmpVectorY = 1.8;
          break;
        case 2:
          tmpVectorY = 1.55;
          break;
        case 3:
          tmpVectorY = 1.4;
          break;
        case 4:
          tmpVectorY = 1.33;
          break;
        case 5:
          tmpVectorY = 1.28;
          break;
        case 6:
          tmpVectorY = 1.24;
          break;
        case 7:
          tmpVectorY = 1.2;
          break;
      }
    }
    return tmpVectorY;
  }, [totalLines]);

  const rasterSourceProps = {
    id: 'stamenWatercolorSource',
    tileUrlTemplates: ['http://a.tile.openstreetmap.org/${z}/${x}/${y}.png'],
    tileSize: 256,
  };
  return (
    <MapboxGL.MapView
      styleURL={MapboxGL.StyleURL.Street}
      style={styles.map}
      userTrackingMode={false}
      attributionEnabled={false}
      zoomLevel={14}
      logoEnabled={false}
      compassEnabled={false}
      rotateEnabled={false}
      preferredFramesPerSecond={30}
      zoomEnabled>
      <MapboxGL.Camera
        ref={cameraRef}
        zoomLevel={14}
        centerCoordinate={[markers?.longitude, markers?.latitude]}
        maxZoomLevel={18}
        minZoomLevel={8}
        maxBounds={{
          ne: [109.36305, 22.805301],
          sw: [101.448316, 8.025235],
        }}
        animationDuration={1000}
      />
    </MapboxGL.MapView>
  );
};

const COLOR_BORDER_LOCK_LOCATION = '#F0A432';
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  wrapLabelLocation: {
    backgroundColor: colors.COLOR_WHITE,
    paddingHorizontal: sizes.SIZE_10,
    paddingVertical: sizes.SIZE_5,
    borderRadius: sizes.SIZE_5,
    maxWidth: sizes.SIZE_120,
    ...commonStyles.center,
    marginBottom: sizes.SIZE_5,
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
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
    borderRadius: sizes.SIZE_30 / sizes.SIZE_2,
    borderColor: COLOR_BORDER_LOCK_LOCATION,
    borderWidth: sizes.SIZE_3,
    zIndex: sizes.SIZE_1,
  },
  imageLock: {
    width: sizes.SIZE_25,
    height: sizes.SIZE_25,
    zIndex: sizes.SIZE_1,
  },
  triangleMarker: {
    width: sizes.ZERO,
    height: sizes.ZERO,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: sizes.SIZE_20,
    borderRightWidth: sizes.SIZE_28 / sizes.SIZE_2,
    borderBottomWidth: sizes.ZERO,
    // borderBottomLeftRadius: sizes.SIZE_5,
    // borderBottomRightRadius: sizes.SIZE_5,
    borderLeftWidth: sizes.SIZE_28 / sizes.SIZE_2,
    borderTopColor: COLOR_BORDER_LOCK_LOCATION,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -sizes.SIZE_9,
    zIndex: 0,
    marginLeft: sizes.SIZE_1,
  },
  wrapLockLocation: {
    backgroundColor: COLOR_BORDER_LOCK_LOCATION,
    width: sizes.SIZE_30,
    height: sizes.SIZE_30,
    borderRadius: sizes.SIZE_30 / sizes.SIZE_2,
    ...commonStyles.center,
    zIndex: sizes.SIZE_1,
  },
});

function areEqual(prevProps, nextProps) {
  return (
    prevProps?.is_block === nextProps?.is_block &&
    prevProps?.markers?.latitude === nextProps?.markers?.latitude &&
    prevProps?.markers?.latitudeDelta === nextProps?.markers?.latitudeDelta &&
    prevProps?.markers?.longitude === nextProps?.markers?.longitude &&
    prevProps?.markers?.longitudeDelta === nextProps?.markers?.longitudeDelta &&
    prevProps?.refresh_location === nextProps?.refresh_location
  );
}

export default React.memo(MapMarker, areEqual);
