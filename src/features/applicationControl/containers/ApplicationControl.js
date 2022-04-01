import React, {useState, useMemo, useRef, useEffect} from 'react';
import {Text, Background, Input} from 'base';
import {View, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import styles from './styles';
import {colors, commonStyles, sizes} from 'styles';
import images from 'images';
import {ItemComponent, ModalUpdateApplicationComponent} from '../components';
import FastImage from 'react-native-fast-image';
import {EmptyData, Loading} from 'components';
import * as RootNavigation from 'RootNavigation';
import {useQuery, useQueryClient} from 'react-query';
import keyTypes from 'keyTypes';
import {
  applicationListApi,
  applicationUpdateApi,
} from 'src/api/methods/application';
import {useMutation} from 'react-query';
import {Toast} from 'customs';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import {ItemListPlaceholder} from '../placeholders';

momentDurationFormatSetup(moment);

const HOURS_DEFAULT = '00';
const MINUTE_DEFAULT = '00';
const HOURS_24 = 24;
const HOURS_23 = 23;
const MINUTE_59 = 59;
const MINUTE_60 = 60;
const ZERO = 0;
const ONE = 1;
const DATA_PLACEHOLDER_LIST = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ApplicationControl = ({route}) => {
  const params = route?.params;
  const typingTimoutRef = useRef(null);
  const queryClient = useQueryClient();
  const [activeRadio, setActiveRadio] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [debounceTextSearch, setDebounceTextSearch] = useState(false);
  const [hours, setHours] = useState(HOURS_DEFAULT);
  const [minutes, setMinutes] = useState(MINUTE_DEFAULT);
  const [activeItem, setActiveItem] = useState({});
  const [visibleDetailModal, setVisibleDetailModal] = useState(false);

  //application list
  const {data, isLoading, isSuccess, refetch} = useQuery(
    [keyTypes.APPLICATION_LIST, params?.device_id],
    () => applicationListApi(params?.device_id),
    {
      keepPreviousData: true,
    },
  );

  //set hours
  useEffect(() => {
    // eslint-disable-next-line radix
    if (parseInt(hours) > ZERO && parseInt(hours) > HOURS_24) {
      setHours(HOURS_24.toString());
    }
  }, [hours]);

  //set minutes
  useEffect(() => {
    // eslint-disable-next-line radix
    if (parseInt(minutes) > ZERO && parseInt(minutes) >= MINUTE_60) {
      setMinutes(MINUTE_59.toString());
    }
    // eslint-disable-next-line radix
    if (parseInt(minutes) > ZERO && parseInt(hours) === HOURS_24) {
      setHours(HOURS_23.toString());
    }
  }, [minutes, hours]);

  //application update
  const mutationUpdate = useMutation(
    ({data_application_id, data_status, data_time_list}) =>
      applicationUpdateApi(data_application_id, data_status, data_time_list),
  );

  const onRefresh = async () => {
    await queryClient.removeQueries(
      [keyTypes.APPLICATION_LIST, params?.device_id],
      {
        exact: true,
      },
    );
    await refetch();
  };

  const applicationList = useMemo(() => {
    let tmpList = [];
    if (textSearch === '') {
      tmpList = [];
    }
    if (isSuccess) {
      let listApplication = data?.data;
      const regex = new RegExp(`${textSearch.trim()}`, 'i');
      tmpList = listApplication?.filter(obj => obj.name.search(regex) >= 0);
      // .slice(0, 1000);
    }
    return tmpList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, debounceTextSearch, isSuccess]);

  const handleSearchTermChange = val => {
    setTextSearch(val);
    if (typingTimoutRef.current) {
      clearTimeout(typingTimoutRef.current);
    }
    typingTimoutRef.current = setTimeout(async () => {
      //typing code
      setDebounceTextSearch(!debounceTextSearch);
    }, 300);
  };

  const resetState = () => {
    setActiveRadio(false);
    setHours(HOURS_DEFAULT);
    setMinutes(MINUTE_DEFAULT);
    setActiveItem({});
  };

  const showModalDetail = item => {
    setVisibleDetailModal(true);
    setActiveItem(item);
    setActiveRadio(item.status ? true : false);
  };

  const handlebUpdate = timeList => {
    setVisibleDetailModal(false);
    mutationUpdate
      .mutateAsync({
        data_application_id: activeItem?.id,
        data_status: activeRadio ? ONE : ZERO,
        data_time_list: activeRadio ? timeList : null,
      })
      .then(resp => {
        if (resp?.status) {
          refetch();
          Toast(resp?.msg);
        } else {
          Toast(resp?.msg);
        }
        resetState();
        mutationUpdate.reset();
      })
      .catch(err => {
        Toast(err?.msg);
        mutationUpdate.reset();
      });
  };
  return (
    <Background bin>
      <Loading isLoading={mutationUpdate.isLoading} />
      <ModalUpdateApplicationComponent
        iconApp={activeItem?.icon}
        nameApp={activeItem?.name}
        onPressClose={() => {
          setVisibleDetailModal(false);
          resetState();
        }}
        visible={visibleDetailModal}
        isActive={activeRadio}
        onPressActive={() => {
          setActiveRadio(!activeRadio);
        }}
        onPressSubmit={list => handlebUpdate(list)}
        activeItemList={activeItem}
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => RootNavigation.goBack()}>
            <FastImage
              style={styles.iconNavBack}
              source={images.icons.nav_back}
            />
          </TouchableOpacity>
          <View style={styles.wrapHeaderInput}>
            <Input
              onChangeValue={handleSearchTermChange}
              placeholder="Nhập nội dung tìm kiếm"
              icon={images.icons.input_search}
            />
          </View>
        </View>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Kiểm soát Ứng dụng
        </Text>
        <View style={styles.wrapTableHeader}>
          <Text style={styles.headerTableTitleOne}>Ứng dụng</Text>
          <Text style={styles.headerTableTitleTwo}>Sử dụng</Text>
          <Text style={styles.headerTableTitleThree}>Trạng thái</Text>
        </View>
        {isLoading ? (
          <FlatList
            initialNumToRender={sizes.SIZE_10}
            data={DATA_PLACEHOLDER_LIST}
            removeClippedSubviews={true}
            renderItem={() => <ItemListPlaceholder />}
            contentContainerStyle={styles.loadingContainer}
          />
        ) : (
          <FlatList
            style={styles.flatList}
            contentContainerStyle={styles.contentContainerFlatlist}
            ListEmptyComponent={<EmptyData />}
            data={applicationList}
            keyExtractor={item => item.id.toString() + item.status}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh}
                tintColor={colors.COLOR_WHITE}
              />
            }
            renderItem={({item}) => (
              <ItemComponent
                onPressDetail={obj => showModalDetail(obj)}
                item={item}
              />
            )}
          />
        )}
      </View>
    </Background>
  );
};

export default ApplicationControl;
