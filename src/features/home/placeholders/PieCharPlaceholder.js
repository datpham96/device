import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';

const PieCharPlaceholder = () => {
  return (
    <SkeletonPlaceholder speed={1000} backgroundColor="#bdbdbd">
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: 60, height: 60, borderRadius: 50}} />
        <View style={{marginLeft: 20}}>
          <View style={{width: 200, height: 20, borderRadius: 4}} />
          <View
            style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default PieCharPlaceholder;
