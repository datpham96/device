import React, {useState} from 'react';
import {Background, Text} from 'base';
import {View, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import {colors, commonStyles} from 'styles';
import FastImage from 'react-native-fast-image';
import images from 'images';
import {ItemChildrenComponent} from '../components';
import styles from './styles';
import {ModalScanQRcode, EmptyData} from 'components';
import * as RootNavigation from 'RootNavigation';
import navigationTypes from 'navigationTypes';
import {Toast} from 'customs';
import {useQuery, useQueryClient} from 'react-query';
import keyTypes from 'keyTypes';
import {deviceListApi} from 'methods/device';
import {ItemChildrenPlaceholder} from '../placeholders';

export type Props = {
  navigation?: any;
};

const ChildrenManager: React.FC<Props> = ({navigation}) => {
  const queryClient = useQueryClient();
  const [visibleQrCode, setVisibleQrCode] = useState(false);

  const {data, isLoading, refetch} = useQuery(
    keyTypes.DEVICE_LIST,
    () => deviceListApi(),
    // {
    //   keepPreviousData: true,
    // },
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const onRefresh = async () => {
    await queryClient.removeQueries(keyTypes.DEVICE_LIST, {
      exact: true,
    });
    await refetch();
  };

  const handleRedirectQrCode = () => {
    setVisibleQrCode(true);
  };

  const handleSucessQRCode = (resp: any) => {
    if (JSON.parse(resp?.data)?.SerialNumber) {
      setVisibleQrCode(false);
      RootNavigation.navigate(navigationTypes.deviceInfo.screen, {
        device_info: JSON.parse(resp?.data),
      });
    } else {
      Toast('Mã QR thiết bị không hợp lệ');
    }
  };
  return (
    <Background bout>
      <ModalScanQRcode
        visible={visibleQrCode}
        onPressClose={() => setVisibleQrCode(false)}
        onSuccessQRCode={(val?: any) => handleSucessQRCode(val)}
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={commonStyles.mainTitle}>Gia đình</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.wrapBtnQrCode}
            onPress={handleRedirectQrCode}>
            <FastImage
              style={styles.iconQrCode}
              source={images.icons.qr_code}
            />
            <Text style={styles.labelQrCode}>Quét mã</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View style={[commonStyles.flex1, styles.flatListStyle]}>
            <ItemChildrenPlaceholder />
            <ItemChildrenPlaceholder />
            <ItemChildrenPlaceholder />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyData />}
            contentContainerStyle={styles.contentContainerFlatlist}
            style={[commonStyles.flex1, styles.flatListStyle]}
            data={data.data}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <ItemChildrenComponent item={item} />}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh}
                tintColor={colors.COLOR_WHITE}
              />
            }
          />
        )}
      </View>
    </Background>
  );
};

export default ChildrenManager;
