import React, {useState, useMemo, useRef, useEffect} from 'react';
import {Text, Background, Input} from 'base';
import {View, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import styles from './styles';
import {colors, commonStyles} from 'styles';
import images from 'images';
import {ItemComponent} from '../components';
import FastImage from 'react-native-fast-image';
import {
  EmptyData,
  LoadingData,
  ModalBlockAccess,
  Loading,
  ModalTimeBlockAccess,
  PopupConfirm,
} from 'components';
import * as RootNavigation from 'RootNavigation';
import {useQuery, useQueryClient} from 'react-query';
import keyTypes from 'keyTypes';
import {webListApi, webUpdateApi} from 'src/api/methods/web';
import {webCreateApi} from 'src/api/methods/web';
import {useMutation} from 'react-query';
import {Toast} from 'customs';
import Validator from 'validatorjs';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import types from '../types';
import {ModalCreateUpdateWebComponent} from '../components';
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

const WebsiteControl = ({route}) => {
  const params = route?.params;
  const typingTimoutRef = useRef(null);
  const queryClient = useQueryClient();
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleTimeBlockAccessModal, setVisibleTimeBlockAccessModal] =
    useState(false);
  const [activeRadio, setActiveRadio] = useState(false);
  const [url, setUrl] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [debounceTextSearch, setDebounceTextSearch] = useState(false);
  const [hours, setHours] = useState(HOURS_DEFAULT);
  const [minutes, setMinutes] = useState(MINUTE_DEFAULT);
  const [itemBlockAccess, setItemBlockAccess] = useState({});
  const [itemRemoveTime, setItemRemoveTime] = useState({});
  const [visiblePopupConfirmRemoveTime, setVisiblePopupConfirmRemoveTime] =
    useState(false);
  const [type, setType] = useState(null);

  const [errors, setErrors] = useState({});

  //website list
  const {data, isLoading, isSuccess, refetch} = useQuery(
    keyTypes.WEB_LIST + '_' + params?.device_id,
    () => webListApi(params?.device_id),
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

  //website create
  const mutationCreate = useMutation(
    ({data_url, data_status, data_time_remaining, data_device_id}) =>
      webCreateApi(data_url, data_status, data_time_remaining, data_device_id),
  );

  //website update
  const mutationUpdate = useMutation(
    ({data_web_id, data_status, data_time_remaining}) =>
      webUpdateApi(data_web_id, data_status, data_time_remaining),
  );

  const onRefresh = async () => {
    await queryClient.removeQueries(
      keyTypes.WEB_LIST + '_' + params?.device_id,
      {
        exact: true,
      },
    );
    await refetch();
  };

  const handleWebCreate = () => {
    // eslint-disable-next-line radix
    let tmpMinutes = parseInt(hours) * MINUTE_60 + parseInt(minutes);
    let validation = new Validator(
      {
        url: url,
      },
      {
        url: 'required|domain',
      },
      {
        'required.url': 'url không được bỏ trống',
      },
    );
    if (validation.fails()) {
      setErrors({...errors, url: validation.errors.first('url')});
      return;
    }

    if (validation.passes()) {
      setErrors({...errors, url: validation.errors.first('url')});
      setVisibleModal(false);
    }

    mutationCreate
      .mutateAsync({
        data_url: url,
        data_status: activeRadio ? ONE : ZERO,
        data_time_remaining: activeRadio ? tmpMinutes : ZERO,
        data_device_id: params?.device_id,
      })
      .then(resp => {
        if (resp?.status) {
          refetch();
          resetState();
          Toast(resp?.msg);
        } else {
          Toast(resp?.msg);
        }
        mutationCreate.reset();
      })
      .catch(err => {
        Toast(err?.msg);
        mutationCreate.reset();
      });
  };

  const handleWebUpdate = () => {
    setVisibleModal(false);
  };

  const websiteList = useMemo(() => {
    let tmpList = [];
    if (textSearch === '') {
      tmpList = [];
    }
    if (isSuccess) {
      let listWebsite = data?.data;
      const regex = new RegExp(`${textSearch.trim()}`, 'i');
      tmpList = listWebsite
        .filter(
          obj => obj.name.search(regex) >= 0 || obj.url.search(regex) >= 0,
        )
        .slice(0, 20);
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
    setErrors({});
    setUrl('');
    setHours(HOURS_DEFAULT);
    setMinutes(MINUTE_DEFAULT);
    setItemBlockAccess({});
  };

  const showModalDetail = item => {
    setVisibleModal(true);
    // const timeUse = moment(item.time_remaining, 'YYYY-MM-DD HH:mm:ss').diff(
    //   moment(),
    //   'minutes',
    // );
    // let tmpTime = '00:00';
    // if (timeUse && timeUse > 0) {
    //   if (timeUse > 60) {
    //     tmpTime = moment.duration(timeUse, 'minutes').format('HH:mm');
    //   } else {
    //     tmpTime = moment.duration(timeUse, 'minutes').format('00:mm');
    //   }
    // }

    // setHours(tmpTime.split(':').length > 0 ? tmpTime.split(':')[0] : '00');
    // setMinutes(tmpTime.split(':').length > 0 ? tmpTime.split(':')[1] : '00');

    // setItemBlockAccess(item);
    // setActiveRadio(item.status ? true : false);
    // setVisibleTimeBlockAccessModal(true);
  };

  const handleTimeBlockAccess = () => {
    setVisibleTimeBlockAccessModal(false);
    // eslint-disable-next-line radix
    let tmpMinutes = parseInt(hours) * MINUTE_60 + parseInt(minutes);
    mutationUpdate
      .mutateAsync({
        data_web_id: itemBlockAccess?.id,
        data_status: activeRadio ? ONE : ZERO,
        data_time_remaining: activeRadio ? tmpMinutes : ZERO,
      })
      .then(resp => {
        if (resp?.status) {
          refetch();
          resetState();
          Toast(resp?.msg);
        } else {
          Toast(resp?.msg);
        }
        mutationUpdate.reset();
      })
      .catch(err => {
        Toast(err?.msg);
        mutationUpdate.reset();
      });
  };

  const handleRemoveTimeBlockAccess = () => {
    setVisiblePopupConfirmRemoveTime(false);
    mutationUpdate
      .mutateAsync({
        data_web_id: itemRemoveTime?.id,
        data_status: ONE,
        data_time_remaining: ZERO,
      })
      .then(resp => {
        if (resp?.status) {
          refetch();
          Toast(resp?.msg);
        } else {
          Toast(resp?.msg);
        }
        mutationUpdate.reset();
      })
      .catch(err => {
        Toast(err?.msg);
        mutationUpdate.reset();
      });
  };

  return (
    <Background bin>
      <Loading
        isLoading={mutationCreate.isLoading || mutationUpdate.isLoading}
      />
      <PopupConfirm
        content="Bạn có muốn gỡ thời gian chặn này không?"
        visible={visiblePopupConfirmRemoveTime}
        onPressAgree={() => handleRemoveTimeBlockAccess()}
        onPressCancel={() => {
          setVisiblePopupConfirmRemoveTime(false);
          setItemRemoveTime({});
        }}
      />
      <ModalCreateUpdateWebComponent
        onFocusHour={() => {
          // eslint-disable-next-line radix
          if (hours.length === 2 && parseInt(hours) === 0) {
            setHours('');
          }
        }}
        onFocusMinute={() => {
          // eslint-disable-next-line radix
          if (minutes.length === 2 && parseInt(minutes) === 0) {
            setMinutes('');
          }
        }}
        onPressClose={() => {
          setVisibleModal(false);
          resetState();
        }}
        visible={visibleModal}
        isActive={activeRadio}
        onPressActive={() => {
          setActiveRadio(!activeRadio);
          setHours(HOURS_DEFAULT);
          setMinutes(MINUTE_DEFAULT);
        }}
        value={url}
        onChangeValue={text => setUrl(text)}
        onPressSubmit={() => {
          if (type === types.create.code) {
            handleWebCreate();
          } else {
            handleWebUpdate();
          }
        }}
        valueHours={hours}
        valueMinutes={minutes}
        onChangeTextHours={val => setHours(val.replace(/[^0-9]/g, ZERO))}
        onChangeTextMinutes={val => setMinutes(val.replace(/[^0-9]/g, ZERO))}
        errors={errors}
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
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setVisibleModal(true);
              setType(types.create.code);
            }}>
            <FastImage
              style={styles.iconHeaderPlus}
              source={images.icons.header_plus}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        </View>
        <Text style={[commonStyles.mainTitle, styles.mainTitleStyle]}>
          Kiểm soát Website
        </Text>
        <View style={styles.wrapTableHeader}>
          <Text style={styles.headerTableTitleOne}>Trang website</Text>
          {/* <Text style={styles.headerTableTitleTwo}>Sử dụng</Text> */}
          <Text style={styles.headerTableTitleThree}>Trạng thái</Text>
        </View>
        {isLoading ? (
          <FlatList
            initialNumToRender={10}
            data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            removeClippedSubviews={true}
            renderItem={() => <ItemListPlaceholder />}
            contentContainerStyle={styles.loadingContainer}
          />
        ) : (
          <FlatList
            style={styles.flatList}
            contentContainerStyle={styles.contentContainerFlatlist}
            ListEmptyComponent={<EmptyData />}
            data={websiteList}
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
                onPressDetail={obj => showModalDetail(obj, types.update.code)}
                item={item}
              />
            )}
          />
        )}
      </View>
    </Background>
  );
};

export default WebsiteControl;
