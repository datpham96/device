import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';
//node_modules
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import {useQueryClient, useQuery} from 'react-query';
//api
import {deviceListApi} from 'methods/device';
import {webReportAccessApi} from 'methods/web';
//base
import {Text, Background, Button} from 'base';
//components
import {LoadingData} from 'components';
//config
import images from 'images';
import {colors, sizes, commonStyles} from 'styles';
import metrics from 'metrics';
//helpers
import {formatNumberThousand} from 'src/helpers/funcs';
//navigation
import keyTypes from 'keyTypes';
import navigationTypes from 'navigationTypes';
//feature
import {BlockFilterSearch, BlockTotal, Chart} from '../components';
import styles from './styles';
//code-splitting
const DateTimePicker = React.lazy(() =>
  import('src/components/DateTimePickerComponent'),
);
const DeviceSelect = React.lazy(() =>
  import('../components/DeviceSelectComponent'),
);
//screen
const Home = ({navigation}) => {
  //constructor
  const queryClient = useQueryClient();
  const dateTimeRef = useRef(null);
  const [date, onDate] = useState(moment().format('DD/MM/YYYY'));
  const [selectedDevice, onSelectedDevice] = useState(null);
  const [heightSectionTwo, setHeightSectionTwo] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  //request device list
  const {
    data: dataDeviceList,
    refetch: refetchDeviceList,
    isLoading: isLoadingDeviceList,
    isSuccess: isSuccessDeviceList,
  } = useQuery(keyTypes.DEVICE_LIST, () => deviceListApi(), {
    keepPreviousData: true,
  });

  //request report
  const {
    data: dataReportAccess,
    refetch: refetchReportAccess,
    isLoading: isLoadingReportAccess,
    isSuccess: isSuccessReportAccess,
  } = useQuery(
    [keyTypes.WEB_REPORT_ACCESS, {id: selectedDevice?.id, date}],
    () =>
      webReportAccessApi(
        selectedDevice?.id,
        moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      ),
    {
      enabled: !!selectedDevice?.id,
    },
  );

  //get device list when focus screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetchDeviceList();
    });
    return unsubscribe;
  }, [navigation, refetchDeviceList]);

  //handle when blur screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      queryClient.cancelQueries(keyTypes.WEB_REPORT_ACCESS);
      queryClient.cancelQueries(keyTypes.DEVICE_LIST);
    });
    return unsubscribe;
  }, [navigation, queryClient]);

  //handle event when change isLoadingReportAccess
  useEffect(() => {
    if (!isLoadingReportAccess) {
      setRefreshing(false);
    }
  }, [isLoadingReportAccess]);

  //function handle refresh data
  const onRefresh = useCallback(async () => {
    await queryClient.removeQueries(
      [keyTypes.WEB_REPORT_ACCESS, {id: selectedDevice?.id, date}],
      {
        exact: true,
      },
    );
    await refetchReportAccess();
    await refetchDeviceList();
  }, [
    date,
    queryClient,
    refetchDeviceList,
    refetchReportAccess,
    selectedDevice?.id,
  ]);

  //handle format height block
  const formatHeightBlock = useMemo(() => {
    let heightBlock = sizes.ZERO;
    let heightAreaChart = sizes.ZERO;
    if (heightSectionTwo) {
      heightBlock = heightSectionTwo / sizes.SIZE_2 - sizes.SIZE_25;
      heightAreaChart = heightBlock / 2.5;
    }
    return {
      heightBlock,
      heightAreaChart,
    };
  }, [heightSectionTwo]);

  //handle selected device
  const handleSelectedDevice = useCallback(data => {
    onSelectedDevice(data);
  }, []);

  const handleShowDatePicker = () => {
    dateTimeRef.current.onPressDate();
  };

  const handleRedirectControlTab = () => {
    navigation.jumpTo(navigationTypes.childrenManager.screen);
  };

  const onLayoutSectionOne = event => {
    const {height} = event.nativeEvent.layout;
    const heightOutSideBottomTab =
      metrics.screenHeight - metrics.heightBottomTab - metrics.statusBarHeight;
    setHeightSectionTwo(heightOutSideBottomTab - height);
  };

  const formatAreaChart24h = useCallback(arr => {
    let arrChart = [];
    for (var i = 0; i < 24; i++) {
      arrChart[i] = 0;
    }
    if (!arr) {
      return arrChart;
    }

    arr.map(item => {
      arrChart[item.hour] = item.total ? parseFloat(item.total) : 0;
    });

    return arrChart;
  }, []);

  const onRefreshing = useCallback(() => {
    setRefreshing(true);
  }, []);

  let checkDeviceData =
    isSuccessDeviceList &&
    dataDeviceList?.data &&
    dataDeviceList?.data?.length > sizes.ZERO;

  return (
    <Background bottomTab bout>
      {isLoadingDeviceList ? (
        <LoadingData />
      ) : checkDeviceData ? (
        <View style={styles.container}>
          <View onLayout={onLayoutSectionOne} style={styles.sectionOne}>
            <View style={styles.wrapHeader}>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                style={styles.logoLock}
                source={images.logos.lock}
              />
              <Suspense fallback={<></>}>
                <DeviceSelect
                  onSelectedDevice={data => {
                    handleSelectedDevice(data);
                  }}
                  selectedDevice={selectedDevice}
                  dataDeviceList={dataDeviceList}
                  isLoadingDeviceList={isLoadingDeviceList}
                  isSuccessDeviceList={isSuccessDeviceList}
                />
              </Suspense>
            </View>
            <View style={styles.wrapContainerTitle}>
              <View style={styles.wrapTitle}>
                <View style={styles.bar} />
                <Text style={styles.title}>Thống kê chung</Text>
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
                  <Text style={styles.calendarDay}>
                    {moment(date, 'DD/MM/YYYY').format('DD')}
                  </Text>
                </View>
                <Text style={styles.calendarMonth}>
                  Tháng {moment(date, 'DD/MM/YYYY').format('MM')}
                </Text>
              </TouchableOpacity>
            </View>
            {/* chart */}
            <Chart
              dataReportAccess={dataReportAccess}
              isSuccessReportAccess={isSuccessReportAccess}
              isLoadingReportAccess={isLoadingReportAccess}
              dataDeviceList={dataDeviceList}
            />
          </View>
          <ScrollView
            onScrollEndDrag={event => {
              if (Platform.OS === 'ios') {
                if (event.nativeEvent.contentOffset.y < -94) {
                  onRefresh();
                }
              }
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  if (Platform.OS === 'android') {
                    onRefresh();
                  }
                  onRefreshing();
                }}
                tintColor={colors.COLOR_WHITE}
              />
            }
            style={[styles.sectionTwo, {height: heightSectionTwo}]}>
            <View style={styles.wrapHeaderList}>
              <View style={styles.wrapHeaderSelect}>
                <View style={styles.headerVerticalBar} />
                <View style={styles.headerSelect}>
                  <Text style={styles.labelSelectLeft}>Thống kê truy vấn</Text>
                </View>
              </View>
            </View>
            {/* Thống kê truy cập */}
            <View style={styles.reportContainer}>
              <BlockTotal
                isLoading={isLoadingReportAccess}
                heightBlock={formatHeightBlock.heightBlock}
                heightAreaBlock={formatHeightBlock.heightAreaChart}
                total={formatNumberThousand(
                  dataReportAccess?.total_request?.total_request,
                )}
                data={formatAreaChart24h(dataReportAccess?.total_request?.data)}
              />
              <View style={styles.wrapBlockChildren}>
                <BlockFilterSearch
                  isLoading={isLoadingReportAccess}
                  heightBlock={formatHeightBlock.heightBlock}
                  heightAreaBlock={formatHeightBlock.heightAreaChart}
                  iconImage={images.icons.area_filter}
                  total={formatNumberThousand(
                    dataReportAccess?.blocked?.total_blocked,
                  )}
                  title="Chặn bởi bộ lọc"
                  data={formatAreaChart24h(dataReportAccess?.blocked?.data)}
                  svgFillColor={colors.COLOR_AREA_CHART_RED}
                />
                <BlockFilterSearch
                  isLoading={isLoadingReportAccess}
                  heightBlock={formatHeightBlock.heightBlock}
                  heightAreaBlock={formatHeightBlock.heightAreaChart}
                  iconImage={images.icons.area_safe_search}
                  total={formatNumberThousand(
                    dataReportAccess?.safe_search?.total_safe_search,
                  )}
                  title="Tìm kiếm an toàn"
                  data={formatAreaChart24h(dataReportAccess?.safe_search?.data)}
                  svgFillColor={colors.COLOR_AREA_CHART_GREEN}
                />
              </View>
            </View>
          </ScrollView>
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

      <Suspense fallback={<></>}>
        <DateTimePicker
          ref={dateTimeRef}
          date={date}
          onDate={val => onDate(val)}
        />
      </Suspense>
    </Background>
  );
};

export default Home;
