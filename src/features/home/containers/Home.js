/* eslint-disable indent */
import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import {PieChart, EmptyData, LoadingData} from 'components';
import {Text, Background, Loading as BaseLoading, Button} from 'base';
import images from 'images';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, sizes, fonts, commonStyles} from 'styles';
import {Item} from '../components';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import types from '../types';
import {useInfiniteQuery, useQueryClient, useQuery} from 'react-query';
import keyTypes from 'keyTypes';
import {deviceReportApi, deviceListApi} from 'src/api/methods/device';
import {checkVar} from 'src/helpers/funcs';
import lodash from 'lodash';
import navigationTypes from 'navigationTypes';

const DATA_FILTER = [
  {
    label: 'Đã chặn',
    value: 0,
  },
  {
    label: 'Cho phép',
    value: 1,
  },
];

let perPage = 15;
let stopLoadMore = true;

const Home = ({navigation}) => {
  const queryClient = useQueryClient();
  const dateTimeRef = useRef(null);
  const selectFilterRef = useRef(null);
  const selectDeviceRef = useRef(null);
  const [date, onDate] = useState(moment().format('DD/MM/YYYY'));
  const [day, onDay] = useState('');
  const [month, onMonth] = useState('');
  const [selected, onSelected] = useState(0);
  const [selectedDevice, onSelectedDevice] = useState(null);
  const [cateActive, setCateActive] = useState(types.type.website.code);
  const [pieChartActive, setPieChartActive] = useState(0);

  const {
    data,
    fetchNextPage,
    status,
    isFetching,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery(
    keyTypes.DEVICE_REPORT_LIST +
      '_' +
      selectedDevice?.id +
      '_' +
      date +
      '_' +
      selected,
    ({pageParam = 1}) =>
      deviceReportApi(
        pageParam,
        perPage,
        selectedDevice?.id,
        moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        selected,
        null,
      ),
    {
      keepPreviousData: true,
      getNextPageParam: lastPage => {
        // eslint-disable-next-line radix
        return parseInt(lastPage.current_page) < lastPage.last_page
          ? // eslint-disable-next-line radix
            parseInt(lastPage.current_page) + 1
          : undefined;
      },
      // eslint-disable-next-line no-shadow
      select: data => {
        return {
          pages: data.pages.flatMap(pageItem => {
            if (checkVar.isEmpty(pageItem.data)) {
              return [];
            }
            return pageItem.data;
          }),
          total_block: data?.pages[0].total_block,
          total_allow: data?.pages[0].total_allow,
        };
      },
    },
  );

  //device list
  const {
    data: dataDeviceList,
    refetch: refetchDeviceList,
    isLoading: isLoadingDeviceList,
    isSuccess: isSuccessDeviceList,
  } = useQuery(keyTypes.DEVICE_LIST, () => deviceListApi(), {
    keepPreviousData: true,
    enabled: false,
  });

  //event when change date
  useEffect(() => {
    if (date) {
      onDay(moment(date, 'DD/MM/YYYY').format('DD'));
      onMonth(moment(date, 'DD/MM/YYYY').format('MM'));
      refetch();
    }
  }, [date, refetch]);

  //event when change filter
  useEffect(() => {
    refetch();
  }, [selected, refetch]);

  //get device list when focus screen
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetchDeviceList();
    });
    return unsubscribe;
  }, [navigation, refetchDeviceList]);

  //format device list
  const deviceList = useMemo(() => {
    let tmpDataList = [];
    if (isSuccessDeviceList && dataDeviceList?.data) {
      dataDeviceList.data.map(item => {
        tmpDataList.push({
          label: item.full_name,
          value: item.id,
        });
      });
    }

    return tmpDataList;
  }, [isSuccessDeviceList, dataDeviceList]);

  //format report list
  const dataPieChartList = useMemo(() => {
    let tmpDataList = [];
    if (status === 'success' && !checkVar.isEmpty(data)) {
      let percentOfTotal =
        // eslint-disable-next-line radix
        parseInt(data?.total_block) + parseInt(data?.total_allow);
      tmpDataList.push({
        // device: types.type.website.code,
        value: Math.ceil((data?.total_block / percentOfTotal) * 100),
        color: colors.COLOR_CHART_YELLOW,
        label: types.status.block.name,
        code: types.status.block.code,
        total: data?.total_block,
      });
      tmpDataList.push({
        // device: types.type.website.code,
        value: Math.ceil((data?.total_allow / percentOfTotal) * 100),
        color: colors.COLOR_CHART_BLUE,
        label: types.status.allow.name,
        code: types.status.allow.code,
        total: data?.total_allow,
      });
    }

    return tmpDataList;
  }, [data, status]);

  useEffect(() => {
    if (isSuccessDeviceList && dataDeviceList?.data) {
      onSelectedDevice(dataDeviceList?.data[0]);
    }
  }, [dataDeviceList, isSuccessDeviceList]);

  const onRefresh = async () => {
    await queryClient.removeQueries(
      keyTypes.DEVICE_REPORT_LIST +
        '_' +
        selectedDevice?.id +
        '_' +
        date +
        '_' +
        selected,
      {
        exact: true,
      },
    );
    await refetch();
  };

  const getMore = () => {
    if (!stopLoadMore && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleShowDatePicker = () => {
    dateTimeRef.current.onPressDate();
  };

  const handleSelectedFilter = val => {
    onSelected(val);
  };

  const handleSelectedDevice = val => {
    onSelectedDevice(val);
  };

  const handleShowFilterSelect = () => {
    if (Platform.OS === 'ios') {
      selectFilterRef.current.togglePicker();
    } else {
      selectFilterRef.current.focus();
    }
  };

  const handleShowDeviceSelect = () => {
    if (Platform.OS === 'ios') {
      selectDeviceRef.current.togglePicker();
    } else {
      selectDeviceRef.current.focus();
    }
  };

  const handleActivePieChart = useCallback(key => {
    setPieChartActive(key);
  }, []);

  const handlePieChartActive = key => {
    setPieChartActive(key);
  };

  const handleRedirectControlTab = () => {
    navigation.jumpTo(navigationTypes.childrenManager.screen);
  };

  return (
    <Background bottomTab bout>
      {isLoadingDeviceList ? (
        <LoadingData />
      ) : isSuccessDeviceList &&
        dataDeviceList?.data &&
        dataDeviceList?.data?.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.wrapHeader}>
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              style={styles.logoLock}
              source={images.logos.lock}
            />
            <TouchableOpacity
              style={styles.wrapSelected}
              activeOpacity={0.9}
              onPress={handleShowDeviceSelect}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={sizes.SIZE_20}
                color={colors.COLOR_WHITE}
                style={styles.iconChevronLeft}
              />
              <View style={styles.wrapAvatarDevice}>
                <FastImage
                  source={
                    selectedDevice?.is_block === 1
                      ? selectedDevice.avatar
                        ? {uri: selectedDevice.avatar}
                        : images.avatars.default
                      : images.avatars.shield
                  }
                  style={styles.avatarShield}
                  resizeMode={FastImage.resizeMode.contain}
                />
                {selectedDevice && selectedDevice?.is_online === 1 && (
                  <View style={styles.dotOnline} />
                )}
              </View>
              <Text style={styles.titleShield}>
                {selectedDevice?.full_name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.wrapContainerTitle}>
            <View style={styles.wrapTitle}>
              <View style={styles.bar} />
              <Text style={styles.title}>Thống kê truy cập</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleShowDatePicker}
              style={styles.wrapSelectCalendar}>
              <View style={styles.wrapCalendar}>
                <FastImage
                  style={styles.iconWrapCalendar}
                  source={images.icons.wrapCalendar}
                />
                <Text style={styles.calendarDay}>{day}</Text>
              </View>
              <Text style={styles.calendarMonth}>Tháng {month}</Text>
            </TouchableOpacity>
          </View>
          {deviceList && deviceList.length > 0 && (
            <View style={styles.chartContainer}>
              <PieChart
                selectedKey={pieChartActive}
                onSelected={handleActivePieChart}
                dataList={dataPieChartList}
              />
              <View style={styles.wrapParams}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => console.log('website')}
                  style={styles.paramInfo}>
                  <Text style={styles.paramInfoLabel}>Website</Text>
                  {dataPieChartList.map((item, key) => {
                    return (
                      <TouchableOpacity
                        key={key}
                        activeOpacity={0.9}
                        onPress={() => handlePieChartActive(key)}
                        style={styles.wrapParamInfoValue}>
                        <View
                          style={[
                            styles.paramInfoValueDot,
                            {backgroundColor: item.color},
                          ]}
                        />
                        <Text
                          style={[
                            styles.paramInfoValue,
                            pieChartActive === key
                              ? {fontFamily: fonts.lexendDeca.FONT_BOLD}
                              : {},
                          ]}>
                          {item.label}: {item.total}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </TouchableOpacity>
                {/* <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => console.log('application')}
              style={styles.paramInfo}>
              <Text
                style={[styles.paramInfoLabel, {color: colors.COLOR_WHITE}]}>
                Ứng dụng
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => console.log('Đã chặn')}
                style={styles.wrapParamInfoValue}>
                <View style={styles.paramInfoValueDot} />
                <Text style={styles.paramInfoValue}>Đã chặn: 8</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => console.log('Cho phép')}
                style={styles.wrapParamInfoValue}>
                <View
                  style={[
                    styles.paramInfoValueDot,
                    {backgroundColor: colors.COLOR_CHART_YELLOW},
                  ]}
                />
                <Text
                  style={[
                    styles.paramInfoValue,
                    {fontFamily: fonts.lexendDeca.FONT_BOLD},
                  ]}>
                  Cho phép: 8
                </Text>
              </TouchableOpacity>
            </TouchableOpacity> */}
              </View>
            </View>
          )}

          <View style={styles.wrapHeaderList}>
            <View style={styles.wrapHeaderSelect}>
              <View style={styles.headerVerticalBar} />
              <View style={styles.headerSelect}>
                <Text
                  onPress={() => setCateActive(types.type.website.code)}
                  style={[
                    styles.labelSelectLeft,
                    {
                      fontFamily:
                        cateActive === types.type.website.code
                          ? fonts.lexendDeca.FONT_BOLD
                          : fonts.lexendDeca.FONT_REGULAR,
                    },
                  ]}>
                  Website
                </Text>
                {/* <View style={styles.spaceVerticalBar} />
              <Text
                onPress={() => setCateActive(types.type.application.code)}
                style={[
                  styles.labelSelectRight,
                  {
                    fontFamily:
                      cateActive === types.type.application.code
                        ? fonts.lexendDeca.FONT_BOLD
                        : fonts.lexendDeca.FONT_REGULAR,
                  },
                ]}>
                Ứng dụng
              </Text> */}
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleShowFilterSelect}
              style={styles.wrapFilter}>
              <Text style={styles.labelFilter}>Bộ lọc</Text>
              <Image style={styles.iconFilter} source={images.icons.filter} />
            </TouchableOpacity>
          </View>
          {/* <FlatList
          style={styles.flatList}
          data={DATA}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <Item item={item} />}
        /> */}
          {status === 'loading' ? (
            <LoadingData />
          ) : status === 'success' && !checkVar.isEmpty(data?.pages) ? (
            <FlatList
              ListFooterComponent={
                isFetchingNextPage && isFetching && <BaseLoading />
              }
              ListFooterComponentStyle={[
                {marginTop: sizes.SIZE_10},
                commonStyles.center,
              ]}
              style={styles.flatList}
              contentContainerStyle={styles.contentContainerFlatlist}
              data={lodash.flattenDeep(data?.pages)}
              showsVerticalScrollIndicator={false}
              keyExtractor={(_, key) => key}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={onRefresh}
                  tintColor={colors.COLOR_WHITE}
                />
              }
              refreshing={false}
              onRefresh={onRefresh}
              onEndReached={getMore}
              onEndReachedThreshold={0.05}
              onScrollBeginDrag={() => {
                stopLoadMore = false;
              }}
              renderItem={({item}) => <Item item={item} />}
            />
          ) : (
            <EmptyData />
          )}
        </View>
      ) : (
        <View style={[commonStyles.flex1, commonStyles.center]}>
          <Button
            customStyle={styles.btnNowConnect}
            onPress={handleRedirectControlTab}
            label="Kết nối ngay"
          />
        </View>
      )}

      <DatePicker
        ref={dateTimeRef}
        locale="vi"
        mode="date"
        date={date}
        confirmBtnText="Xác nhận"
        cancelBtnText="Hủy"
        showIcon={false}
        placeholder={''}
        androidMode="spinner"
        style={styles.datePicker}
        customStyles={{
          btnTextConfirm: {
            color: colors.COLOR_BLUE,
          },
        }}
        format="DD/MM/YYYY"
        maxDate={moment().format('DD/MM/YYYY').toString()}
        onDateChange={val => onDate(val)}
      />
      <RNPickerSelect
        pickerProps={{ref: Platform.OS === 'android' ? selectFilterRef : null}}
        ref={Platform.OS === 'ios' ? selectFilterRef : null}
        placeholder={{
          label: '--Chọn--',
          value: 0,
        }}
        value={selected}
        onValueChange={val => {
          handleSelectedFilter(val);
          // if (Platform.OS === 'android') {
          //   handleSelectedFilter(val);
          // }
        }}
        items={DATA_FILTER}
        doneText="Xác nhận"
        // onDonePress={val => handleSelectedFilter(val)}
        fixAndroidTouchableBug={true}
        style={{
          viewContainer: {
            width: sizes.ZERO,
            height: sizes.ZERO,
          },
        }}
      />
      <RNPickerSelect
        pickerProps={{ref: Platform.OS === 'android' ? selectDeviceRef : null}}
        ref={Platform.OS === 'ios' ? selectDeviceRef : null}
        placeholder={{
          label: '--Chọn--',
          value: selectedDevice?.id,
        }}
        value={selectedDevice?.id}
        onValueChange={val => {
          if (dataDeviceList && dataDeviceList?.data) {
            let info = lodash.find(dataDeviceList?.data, {id: val});
            handleSelectedDevice(info);
          }

          // if (Platform.OS === 'android') {
          //   handleSelectedDevice(val);
          // }
        }}
        items={deviceList}
        doneText="Xác nhận"
        // onDonePress={val => handleSelectedDevice(val)}
        // fixAndroidTouchableBug={true}
        style={{
          viewContainer: {
            width: sizes.ZERO,
            height: sizes.ZERO,
          },
        }}
      />
    </Background>
  );
};

export default Home;
