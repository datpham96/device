import React from 'react';
import {View, StyleSheet, Alert, Linking} from 'react-native';
import {Text, Avatar} from 'base';
import {commonStyles, sizes} from 'styles';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {checkVar} from 'src/helpers/funcs';
momentDurationFormatSetup(moment);

const ItemComponent = ({item}) => {
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
      onLongPress={() => handleShowDetail(item?.url)}
      style={styles.container}>
      <View style={styles.wrapItemWebsite}>
        <Avatar
          uriImage={item?.icon}
          containerStyle={styles.imageContainer}
          imageStyle={styles.image}
          isWeb
        />
        <View style={styles.wrapInfo}>
          <Text
            props={{
              numberOfLines: 1,
            }}
            style={styles.name}>
            {item?.name}
          </Text>
          {!checkVar.isEmpty(item?.domain) && (
            <Text
              props={{
                numberOfLines: 1,
              }}
              style={styles.domain}>
              {item?.domain}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.wrapTime}>
        {/* <Text style={styles.time}>{duration}</Text> */}
        <Text style={styles.time}>
          {moment(item?.access_time, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
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
  name: {
    marginBottom: sizes.SIZE_3,
  },
  domain: {
    fontSize: sizes.SIZE_13,
  },
  wrapTime: {},
  time: {},
});

export default ItemComponent;
