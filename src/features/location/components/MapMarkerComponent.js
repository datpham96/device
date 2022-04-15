/* eslint-disable indent */
import React, {useRef, useEffect, useState, useMemo} from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import {colors, sizes, commonStyles, fonts} from 'styles';
import images from 'images';
import {Text} from 'base';
import FastImage from 'react-native-fast-image';
import MapboxGL from '@react-native-mapbox-gl/maps';
import env from '../../../environment';
import moment from 'moment';
import {Loading} from 'components';

const DEFAULT_ZOOM = sizes.SIZE_14;
const MAX_ZOOM = sizes.SIZE_18;
const MIN_ZOOM = sizes.SIZE_8;

MapboxGL.setAccessToken(env.maps_box.accessToken);

const MapMarker = ({
  markers,
  is_block,
  refresh_location,
  timeUpdateLast,
  refetching,
}) => {
  const cameraRef = useRef(null);
  const mapRef = useRef(null);
  const [totalLines, setTotalLines] = useState(0);
  const [loading, setLoading] = useState(false);
  const [anchor, setAnchor] = useState({x: 0.5, y: 0.5});

  useEffect(() => {
    if (cameraRef?.current && refresh_location > 0) {
      // setTimeout(() => {
      //   cameraRef.current.zoomTo(DEFAULT_ZOOM);
      // }, 300);

      cameraRef.current.moveTo([markers?.longitude, markers?.latitude], 500);
    }
  }, [refresh_location, markers, refetching]);
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
      if (timeUpdateLast) {
        switch (totalLines) {
          case 1:
            tmpVectorY = 1.4;
            break;
          case 2:
            tmpVectorY = 1.35;
            break;
          case 3:
            tmpVectorY = 1.29;
            break;
          case 4:
            tmpVectorY = 1.25;
            break;
          case 5:
            tmpVectorY = 1.22;
            break;
          case 6:
            tmpVectorY = 1.2;
            break;
          case 7:
            tmpVectorY = 1.17;
            break;
        }
      }
    }

    return tmpVectorY;
  }, [totalLines, timeUpdateLast]);

  const handleOnRegionIsChanging = async () => {
    if (mapRef?.current) {
      const zoom = await mapRef.current.getZoom();
      if (zoom > 17 && zoom < 18) {
        setAnchor({
          x: 0.5,
          y: 0.7,
        });
      }
      if (zoom > 16 && zoom < 17) {
        setAnchor({
          x: 0.5,
          y: 0.8,
        });
      }
      if (zoom > 15 && zoom < 16) {
        setAnchor({
          x: 0.5,
          y: 0.88,
        });
      }
      if (zoom > 14 && zoom < 15) {
        setAnchor({
          x: 0.5,
          y: 0.92,
        });
      }
      if (zoom > 13 && zoom < 14) {
        setAnchor({
          x: 0.5,
          y: 0.95,
        });
      }
      if (zoom > 12 && zoom < 13) {
        setAnchor({
          x: 0.5,
          y: 0.95,
        });
      }
      if (zoom > 11 && zoom < 12) {
        setAnchor({
          x: 0.5,
          y: 0.95,
        });
      }
      if (zoom > 10 && zoom < 11) {
        setAnchor({
          x: 0.5,
          y: 0.95,
        });
      }
      if (zoom > 9 && zoom < 10) {
        setAnchor({
          x: 0.5,
          y: 0.95,
        });
      }
      if (zoom > 8 && zoom < 9) {
        setAnchor({
          x: 0.5,
          y: 0.95,
        });
      }
    }
  };

  return (
    <>
      <Loading isLoading={loading} />
      <MapboxGL.MapView
        onDidFinishLoadingMap={() => {
          setLoading(false);
        }}
        onWillStartRenderingMap={() => {
          setLoading(true);
        }}
        onRegionIsChanging={handleOnRegionIsChanging}
        ref={mapRef}
        styleURL={MapboxGL.StyleURL.Street}
        style={styles.map}
        userTrackingMode={false}
        attributionEnabled={false}
        logoEnabled={false}
        compassEnabled={false}
        rotateEnabled={false}
        preferredFramesPerSecond={30}
        zoomEnabled={true}>
        <View>
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={DEFAULT_ZOOM}
            centerCoordinate={[markers?.longitude, markers?.latitude]}
            maxZoomLevel={MAX_ZOOM}
            minZoomLevel={MIN_ZOOM}
            maxBounds={{
              ne: [109.36305, 22.805301],
              sw: [101.448316, 8.025235],
            }}
            animationDuration={1000}
            // animationMode={'flyTo'}
          />
          {Platform.OS === 'android' && (
            <MapboxGL.MarkerView
              id="marker_3"
              // anchor={{
              //   x: 0.5,
              //   y: -0.3,
              // }}
              anchor={anchor}
              coordinate={[markers?.longitude, markers?.latitude]}>
              <View style={styles.triangleMarker} />
            </MapboxGL.MarkerView>
          )}
          {Platform.OS === 'android' && (
            <MapboxGL.MarkerView
              anchor={{...anchor, y: anchor.y + 0.4}}
              id="marker_1"
              coordinate={[markers?.longitude, markers?.latitude]}>
              <View style={commonStyles.center}>
                <Image
                  style={styles.imageMarker}
                  source={
                    is_block
                      ? images.icons.lock_location
                      : markers?.avatar
                      ? {uri: markers.avatar, priority: FastImage.priority.low}
                      : images.avatars.default
                  }
                />
              </View>
            </MapboxGL.MarkerView>
          )}
          {Platform.OS === 'ios' && (
            <MapboxGL.MarkerView
              anchor={anchor}
              id="marker_1"
              coordinate={[markers?.longitude, markers?.latitude]}>
              <View style={commonStyles.center}>
                {markers?.address && (
                  <View style={styles.wrapLabelLocation}>
                    {timeUpdateLast && (
                      <Text style={styles.textLastUpdate}>
                        Cập nhật lần cuối:{' '}
                        {moment(timeUpdateLast, 'YYYY-MM-DD HH:mm:ss').format(
                          'HH:mm:ss DD/MM/YYYY',
                        )}
                      </Text>
                    )}
                    <Text style={styles.labelLocation}>{markers?.address}</Text>
                  </View>
                )}
                <Image
                  style={styles.imageMarker}
                  source={
                    is_block
                      ? images.icons.lock_location
                      : markers?.avatar
                      ? {uri: markers.avatar, priority: FastImage.priority.low}
                      : images.avatars.default
                  }
                />
                <View style={styles.triangleMarker} />
              </View>
            </MapboxGL.MarkerView>
          )}
          {Platform.OS === 'android' && markers?.address && (
            <MapboxGL.MarkerView
              id="marker_2"
              anchor={{
                x: 0.5,
                y: vectorY + 0.3,
              }}
              // anchor={{...anchor, y: anchor.y + 0.7}}
              coordinate={[markers?.longitude, markers?.latitude]}>
              <View style={styles.wrapLabelLocation}>
                {timeUpdateLast && (
                  <Text style={styles.textLastUpdate}>
                    Cập nhật lần cuối:{' '}
                    {moment(timeUpdateLast, 'YYYY-MM-DD HH:mm:ss').format(
                      'HH:mm:ss DD/MM/YYYY',
                    )}
                  </Text>
                )}
                <Text
                  props={{
                    onTextLayout: ({nativeEvent: {lines}}) => {
                      setTotalLines(lines?.length);
                    },
                  }}
                  style={styles.labelLocation}>
                  {markers?.address}
                </Text>
              </View>
            </MapboxGL.MarkerView>
          )}
        </View>
      </MapboxGL.MapView>
    </>
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
    maxWidth: sizes.SIZE_140,
    justifyContent: 'flex-start',
    marginBottom: sizes.SIZE_5,
  },
  labelLocation: {
    color: colors.COLOR_BLACK,
    fontSize: sizes.SIZE_10,
  },
  textLastUpdate: {
    color: colors.COLOR_BLACK,
    fontSize: sizes.SIZE_10,
    fontFamily: fonts.lexendDeca.FONT_BOLD,
    marginBottom: sizes.SIZE_3,
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
    prevProps?.refresh_location === nextProps?.refresh_location &&
    prevProps?.refetching === nextProps?.refetching
    // &&
    // prevProps?.timeUpdateLast === nextProps?.timeUpdateLast
  );
}

export default React.memo(MapMarker, areEqual);
