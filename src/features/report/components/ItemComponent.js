import React from 'react';
import {View, StyleSheet, Alert, Linking} from 'react-native';
import {Text, Avatar} from 'base';
import {commonStyles, sizes} from 'styles';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import {TouchableOpacity} from 'react-native-gesture-handler';
momentDurationFormatSetup(moment);

const ItemComponent = ({item}) => {
  const timeUse = moment(item.access_time, 'YYYY-MM-DD HH:mm:ss').diff(
    moment(),
    'minutes',
  );
  let duration = '0h';
  if (timeUse && timeUse > 0) {
    if (timeUse > 60) {
      // duration = moment.duration(timeUse, 'minutes').format('HH');
      duration = moment.duration(timeUse, 'minutes').format('HHgmmp');
    } else {
      duration = moment.duration(timeUse, 'minutes').format('mmp');
    }
  }

  const handleShowDetail = url => {
    Alert.alert('Thông tin', url, [
      {
        text: 'Đóng',
        style: 'cancel',
      },
      {
        text: 'Truy cập',
        onPress: () => Linking.openURL(url),
      },
    ]);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={() => handleShowDetail(item.url)}
      style={styles.container}>
      <View style={styles.wrapItemWebsite}>
        <Avatar
          uriImage={item.icon}
          containerStyle={styles.imageContainer}
          imageStyle={styles.image}
        />
        <View style={styles.wrapInfo}>
          <Text
            props={{
              numberOfLines: 1,
            }}
            style={styles.name}>
            {item.name}
          </Text>
          <Text
            props={{
              numberOfLines: 1,
            }}
            style={styles.domain}>
            {item.domain}
          </Text>
        </View>
      </View>
      <View style={styles.wrapTime}>
        {/* <Text style={styles.time}>{duration}</Text> */}
        <Text style={styles.time}>
          {moment(item.access_time, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.SIZE_15,
  },
  wrapItemWebsite: {
    flexDirection: 'row',
    alignItems: 'center',
    ...commonStyles.flex1,
    marginRight: sizes.SIZE_10,
  },
  imageContainer: {
    width: sizes.SIZE_50,
    height: sizes.SIZE_50,
  },
  image: {
    width: sizes.SIZE_50,
    height: sizes.SIZE_50,
  },
  wrapInfo: {
    marginLeft: sizes.SIZE_10,
    flex: 1,
  },
  name: {},
  domain: {
    fontSize: sizes.SIZE_13,
    marginTop: sizes.SIZE_3,
  },
  wrapTime: {},
  time: {},
});

export default ItemComponent;
