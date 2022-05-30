import React from 'react';
import {View} from 'react-native';
//node_modules
import FastImage from 'react-native-fast-image';
//api
//base
import {Text, Button, Background} from 'base';
//components
//config
import images from 'images';
import {commonStyles} from 'styles';
//helpers
//HOC
//hooks
//navigation
//storages
//redux-stores
//feature
import styles from './styles';
//code-splitting
//screen
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
