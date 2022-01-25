import React from 'react';
import {Text, Button, Background} from 'base';
import {View} from 'react-native';
import images from 'images';
import styles from './styles';
import {commonStyles} from 'styles';
import FastImage from 'react-native-fast-image';
import * as RootNavigation from 'RootNavigation';

const Success = ({route}) => {
  const content = route?.params?.content;
  const labelBtn = route?.params?.labelBtn;
  const screenName = route?.params?.screenName;
  const handleBtn = () => {
    if (screenName) {
      RootNavigation.navigate(screenName);
    }
  };
  return (
    <Background bout>
      <View style={styles.contentContainer}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={styles.logo}
          source={images.logos.success}
        />
        <Text style={[commonStyles.mainTitle, styles.mainTitle]}>
          Thành công
        </Text>
        <Text style={styles.content}>{content}</Text>
        <Button onPress={handleBtn} customStyle={styles.btn} label={labelBtn} />
      </View>
    </Background>
  );
};

export default Success;
