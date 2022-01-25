import React from 'react';
import {Text, Button, Background} from 'base';
import {View} from 'react-native';
import images from 'images';
import styles from './styles';
import {commonStyles} from 'styles';
import FastImage from 'react-native-fast-image';

export type Props = {
  content?: any;
  labelBtn?: any;
  onPressBtn?: any;
};

const Error: React.FC<Props> = ({content, labelBtn, onPressBtn}) => {
  return (
    <Background bout>
      <View style={styles.contentContainer}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={styles.logo}
          source={images.logos.error}
        />
        <Text style={[commonStyles.mainTitle, styles.mainTitleError]}>
          Cảnh báo
        </Text>
        <Text style={styles.content}>{content}</Text>
        {labelBtn && (
          <Button
            onPress={onPressBtn}
            customStyle={styles.btn}
            label={labelBtn}
          />
        )}
      </View>
    </Background>
  );
};

export default Error;
