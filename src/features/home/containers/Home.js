import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {PieChart, LoadingData, Loading} from 'components';
import {Text, Background, Button} from 'base';
import images from 'images';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, sizes, fonts, commonStyles} from 'styles';
import {BlockFilterSearch, BlockTotal} from '../components';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import types from '../types';
import {useQueryClient, useQuery} from 'react-query';
import keyTypes from 'keyTypes';
import {deviceListApi} from 'src/api/methods/device';
import {webReportAccessApi} from 'src/api/methods/web';
import {checkVar, truncateWords} from 'src/helpers/funcs';
import lodash from 'lodash';
import navigationTypes from 'navigationTypes';
import {
  DevicePlaceholder,
  NumberPlaceholder,
  PieCharPlaceholder,
} from '../placeholders';
import {DropdownSelected} from 'components';
import metrics from 'metrics';

const Home = ({navigation}) => {
  const queryClient = useQueryClient();
  const dateTimeRef = useRef(null);
  const [date, onDate] = useState(moment().format('DD/MM/YYYY'));
  const [day, onDay] = useState('');
  const [month, onMonth] = useState('');
  const [selectedDevice, onSelectedDevice] = useState(null);
  const [pieChartActive, setPieChartActive] = useState(0);
  const [toggleDeviceSelected, setToggleDeviceSelected] = useState(false);
  const [heightSectionTwo, setHeightSectionTwo] = useState(0);

  //request report
  const {
    data: dataReportAccess,
    refetch: refetchReportAccess,
    isLoading: isLoadingReportAccess,
    isSuccess: isSuccessReportAccess,
    isFetching: isFetchingReportAccess,
    // isRefetching: isRefetchingReportAccess,
    isFetched: isFetchedReportAccess,
  } = useQuery(
    keyTypes.WEB_REPORT_ACCESS + '_' + selectedDevice?.id + '_' + date,
    () =>
      webReportAccessApi(
        selectedDevice?.id,
        moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      ),
    // {
    //   keepPreviousData: true,
    // },
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
    }
  }, [date]);

  //get device list when focus screen
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetchDeviceList();
      refetchReportAccess();
    });
    return unsubscribe;
  }, [navigation, refetchDeviceList, refetchReportAccess]);

  useEffect(() => {
    if (isSuccessDeviceList && dataDeviceList?.data) {
      onSelectedDevice(dataDeviceList?.data[0]);
    }
  }, [dataDeviceList, isSuccessDeviceList]);

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
    if (isSuccessReportAccess && !checkVar.isEmpty(dataReportAccess)) {
      let totalRequest = dataReportAccess?.total_request?.total_request;
      let totalBlocked = dataReportAccess?.blocked?.total_blocked;
      let totalAccess = totalRequest - totalBlocked;
      let percentBlock = (totalAccess / totalRequest) * 100;
      tmpDataList.push({
        value: parseFloat(percentBlock.toFixed(1)),
        color: colors.COLOR_CHART_BLUE,
        label: types.status.allow.name,
        code: types.status.allow.code,
        total: totalAccess,
      });
      tmpDataList.push({
        value: parseFloat((100 - percentBlock).toFixed(1)),
        color: colors.COLOR_CHART_RED,
        label: types.status.block.name,
        code: types.status.block.code,
        total: totalBlocked,
      });
    }

    return tmpDataList;
  }, [dataReportAccess, isSuccessReportAccess]);

  const onRefresh = async () => {
    await queryClient.removeQueries(
      keyTypes.WEB_REPORT_ACCESS + '_' + selectedDevice?.id + '_' + date,
      {
        exact: true,
      },
    );
    // await queryClient.removeQueries(keyTypes.DEVICE_LIST, {
    //   exact: true,
    // });
    await refetchReportAccess();
    // await refetchDeviceList();
  };

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

  const handleShowDatePicker = () => {
    dateTimeRef.current.onPressDate();
  };

  const handleSelectedDevice = val => {
    onSelectedDevice(val);
  };

  const handleShowDeviceSelect = () => {
    setToggleDeviceSelected(!toggleDeviceSelected);
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

  const handleActiveItemDevice = item => {
    if (dataDeviceList && dataDeviceList?.data) {
      let info = lodash.find(dataDeviceList?.data, {id: item.value});
      handleSelectedDevice(info);
      setToggleDeviceSelected(false);
    }
  };

  const formatNumberThousand = num => {
    let total = num;
    if (num / 1000000000 > 1) {
      total = (num / 1000000000).toFixed(1) + 'B';
    } else if (num / 1000000 > 1) {
      total = (num / 1000000).toFixed(1) + 'M';
    } else if (num / 1000 > 1) {
      total = (num / 1000).toFixed(1) + 'K';
    }

    return total;
  };

  const onLayoutSectionOne = event => {
    const {height} = event.nativeEvent.layout;
    const heightOutSideBottomTab =
      metrics.screenHeight - metrics.heightBottomTab - metrics.statusBarHeight;
    setHeightSectionTwo(heightOutSideBottomTab - height);
  };

  const formatAreaChart24h = arr => {
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
  };

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
          <Loading isLoading={isLoadingReportAccess} />
          <TouchableWithoutFeedback
            onPress={() => {
              setToggleDeviceSelected(false);
            }}>
            <View onLayout={onLayoutSectionOne} style={styles.sectionOne}>
              <View style={styles.wrapHeader}>
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  style={styles.logoLock}
                  source={images.logos.lock}
                />
                {isLoadingDeviceList ? (
                  <DevicePlaceholder />
                ) : (
                  <View style={styles.selectedContainer}>
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
                            selectedDevice?.is_block === 0
                              ? selectedDevice.avatar
                                ? {uri: selectedDevice.avatar}
                                : images.avatars.default
                              : images.avatars.shield
                          }
                          style={styles.avatarShield}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                        {selectedDevice && selectedDevice?.is_online === 1 && (
                          <View style={styles.dotOnline} />
                        )}
                        {selectedDevice && selectedDevice?.is_online !== 1 && (
                          <View style={styles.dotOffline} />
                        )}
                      </View>
                      <Text style={styles.titleShield}>
                        {truncateWords(
                          selectedDevice?.full_name,
                          sizes.SIZE_2,
                          '...',
                        )}
                      </Text>
                    </TouchableOpacity>
                    {toggleDeviceSelected && (
                      <DropdownSelected
                        onPressItem={item => handleActiveItemDevice(item)}
                        containerStyle={styles.scrollItemDeviceSelect}
                        data={deviceList}
                        selected={selectedDevice?.id}
                      />
                    )}
                  </View>
                )}
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
                    <Text style={styles.calendarDay}>{day}</Text>
                  </View>
                  <Text style={styles.calendarMonth}>Tháng {month}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chartContainer}>
                {isLoadingReportAccess ? (
                  <PieCharPlaceholder />
                ) : deviceList && deviceList.length > 0 ? (
                  <PieChart
                    selectedKey={pieChartActive}
                    onSelected={handleActivePieChart}
                    dataList={dataPieChartList}
                  />
                ) : (
                  <></>
                )}
                <View style={styles.wrapParams}>
                  <View
                    activeOpacity={0.9}
                    onPress={() => console.log('website')}
                    style={styles.paramInfo}>
                    <Text style={styles.paramInfoLabel}>Thống kê</Text>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handlePieChartActive(0)}
                      style={styles.wrapParamInfoValue}>
                      <View
                        style={[
                          styles.paramInfoValueDot,
                          {backgroundColor: colors.COLOR_CHART_BLUE},
                        ]}
                      />
                      <View style={styles.wrapReportLabel}>
                        <Text
                          style={[
                            styles.paramInfoValue,
                            pieChartActive === 0
                              ? {fontFamily: fonts.lexendDeca.FONT_BOLD}
                              : {},
                          ]}>
                          {types.status.allow.name}:{' '}
                        </Text>
                        {!checkVar.isEmpty(dataPieChartList) ? (
                          <Text>
                            {formatNumberThousand(dataPieChartList[0]?.total)}
                          </Text>
                        ) : (
                          <View>
                            <NumberPlaceholder />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handlePieChartActive(1)}
                      style={styles.wrapParamInfoValue}>
                      <View
                        style={[
                          styles.paramInfoValueDot,
                          {backgroundColor: colors.COLOR_CHART_RED},
                        ]}
                      />
                      <View style={styles.wrapReportLabel}>
                        <Text
                          style={[
                            styles.paramInfoValue,
                            pieChartActive === 1
                              ? {fontFamily: fonts.lexendDeca.FONT_BOLD}
                              : {},
                          ]}>
                          {types.status.block.name}:{' '}
                        </Text>
                        {!checkVar.isEmpty(dataPieChartList) ? (
                          <Text>
                            {formatNumberThousand(dataPieChartList[1]?.total)}
                          </Text>
                        ) : (
                          <View>
                            <NumberPlaceholder />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                    {/* {dataPieChartList.map((item, key) => {
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
                            {item.label}: {formatNumberThousand(item.total)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })} */}
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh}
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
                containerStyle={{height: formatHeightBlock.heightBlock}}
                areaChartStyle={{height: formatHeightBlock.heightAreaChart}}
                total={formatNumberThousand(
                  dataReportAccess?.total_request?.total_request,
                )}
                data={formatAreaChart24h(dataReportAccess?.total_request?.data)}
              />
              <View style={styles.wrapBlockChildren}>
                <BlockFilterSearch
                  containerStyle={{height: formatHeightBlock.heightBlock}}
                  areaChartStyle={{height: formatHeightBlock.heightAreaChart}}
                  iconImage={images.icons.area_filter}
                  total={formatNumberThousand(
                    dataReportAccess?.blocked?.total_blocked,
                  )}
                  title="Chặn bởi bộ lọc"
                  data={formatAreaChart24h(dataReportAccess?.blocked?.data)}
                  svgFillColor={colors.COLOR_AREA_CHART_RED}
                />
                <BlockFilterSearch
                  containerStyle={{height: formatHeightBlock.heightBlock}}
                  areaChartStyle={{height: formatHeightBlock.heightAreaChart}}
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
          datePicker: {
            backgroundColor: metrics.colorScheme === 'dark' ? '#222' : 'white',
          },
          datePickerCon: {
            backgroundColor: metrics.colorScheme === 'dark' ? '#333' : 'white',
          },
        }}
        format="DD/MM/YYYY"
        maxDate={moment().format('DD/MM/YYYY').toString()}
        onDateChange={val => onDate(val)}
      />
    </Background>
  );
};

export default Home;
