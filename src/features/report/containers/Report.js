/* eslint-disable indent */
import React, {useState, useRef, useEffect} from 'react';
import {Text, Background, ButtonBack, Loading as BaseLoading} from 'base';
import {View, FlatList, RefreshControl} from 'react-native';
import styles from './styles';
import {colors, commonStyles, fonts, sizes} from 'styles';
import images from 'images';
import {ItemComponent} from '../components';
import FastImage from 'react-native-fast-image';
import {EmptyData} from 'components';
import {useInfiniteQuery, useQueryClient} from 'react-query';
import keyTypes from 'keyTypes';
import {checkVar} from 'src/helpers/funcs';
import {deviceHistoryApi} from 'src/api/methods/device';
import moment from 'moment';
import {TouchableHighlight} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker-select';
import lodash from 'lodash';
import {ItemListPlaceholder} from '../placeholders';
import metrics from 'metrics';

let perPage = 15;
let stopLoadMore = true;

const Report = ({route}) => {
  const params = route?.params;
  const dateTimeRef = useRef(null);
  const queryClient = useQueryClient();
  const [date, onDate] = useState(moment().format('DD/MM/YYYY'));
  const [activeTab, setActiveTab] = useState(0);

  const {
    data,
    fetchNextPage,
    status,
    isFetching,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [keyTypes.DEVICE_HISTORY_LIST, {deviceId: params?.device_id, date}],
    ({pageParam = 1}) =>
      deviceHistoryApi(
        pageParam,
        perPage,
        params?.device_id,
        moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
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
        };
      },
    },
  );

  useEffect(() => {
    if (date) {
      refetch();
    }
  }, [date, refetch]);

  const getMore = () => {
    if (!stopLoadMore && hasNextPage) {
      fetchNextPage();
    }
  };

  const onRefresh = async () => {
    await queryClient.removeQueries(
      [keyTypes.DEVICE_HISTORY_LIST, {deviceId: params?.device_id, date}],
      {
        exact: true,
      },
    );
    await refetch();
  };

  const handleShowDatePicker = () => {
    dateTimeRef.current.onPressDate();
  };
  return (
    <Background bin>
      {/* <Loading isLoading={isRefetching} /> */}
      <ButtonBack />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
            Truy cập
          </Text>
          <TouchableHighlight
            underlayColor={colors.COLOR_UNDERLAY_BUTTON_BLACK}
            onPress={handleShowDatePicker}
            style={styles.wrapBtnSelectDate}>
            <View style={styles.wrapContentBtnSelectDate}>
              <FastImage source={images.icons.date} style={styles.iconDate} />
              <Text style={styles.textDate}>{date}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.wrapTableHeader}>
          <View style={styles.wrapTabsHeader}>
            <View style={styles.leftDash} />
            <View style={styles.containerTab}>
              <Text
                onPress={() => setActiveTab(0)}
                style={[
                  styles.headerTableTitleOne,
                  {
                    fontFamily:
                      activeTab === 0
                        ? fonts.lexendDeca.FONT_BOLD
                        : fonts.lexendDeca.FONT_REGULAR,
                  },
                ]}>
                Website
              </Text>
              {/* <View style={styles.spaceTab} />
              <Text
                onPress={() => setActiveTab(1)}
                style={[
                  styles.headerTableTitleOne,
                  {
                    fontFamily:
                      activeTab === 1
                        ? fonts.lexendDeca.FONT_BOLD
                        : fonts.lexendDeca.FONT_REGULAR,
                  },
                ]}>
                Ứng dụng
              </Text> */}
            </View>
          </View>
          <Text style={styles.headerTableTitleThree}>Thời gian truy cập</Text>
        </View>
        {status === 'loading' ? (
          <FlatList
            initialNumToRender={10}
            data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            removeClippedSubviews={true}
            renderItem={() => <ItemListPlaceholder />}
            contentContainerStyle={styles.loadingContainer}
          />
        ) : (
          <FlatList
            ListFooterComponent={
              isFetchingNextPage && isFetching && <BaseLoading />
            }
            ListFooterComponentStyle={[
              {marginTop: sizes.SIZE_10},
              commonStyles.center,
            ]}
            ListEmptyComponent={<EmptyData />}
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
            onEndReachedThreshold={0.05}
            onScrollBeginDrag={() => {
              stopLoadMore = false;
            }}
            renderItem={({item}) => <ItemComponent item={item} />}
          />
        )}
      </View>
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

export default Report;
