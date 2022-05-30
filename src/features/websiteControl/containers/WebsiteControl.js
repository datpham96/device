import React, {useState, useMemo, useRef, useEffect, Suspense} from 'react';
import {View, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
//node_modules
import FastImage from 'react-native-fast-image';
import {useQuery, useQueryClient, useMutation} from 'react-query';
import Validator from 'validatorjs';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
//api
import {webListApi, webUpdateApi, webCreateApi} from 'methods/web';
//base
import {Text, Background, Input} from 'base';
//components
import {EmptyData, Loading} from 'components';
//config
import {colors, commonStyles} from 'styles';
import images from 'images';
//helpers
import {flashMessage} from 'helpers/funcs';
//HOC
//hooks
//navigation
import * as RootNavigation from 'RootNavigation';
import keyTypes from 'keyTypes';
//storages
//redux-stores
//feature
import {ItemComponent} from '../components';
import {ItemListPlaceholder} from '../placeholders';
import styles from './styles';
import types from '../types';
//code-splitting
const ModalCreateUpdateWebComponent = React.lazy(() =>
  import('../components/ModalCreateUpdateWebComponent'),
);
//screen

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
  const [activeRadio, setActiveRadio] = useState(false);
  const [url, setUrl] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [debounceTextSearch, setDebounceTextSearch] = useState(false);
  const [hours, setHours] = useState(HOURS_DEFAULT);
  const [minutes, setMinutes] = useState(MINUTE_DEFAULT);
  const [type, setType] = useState(null);

  const [errors, setErrors] = useState({});
  const [activeItem, setActiveItem] = useState({});
  const [isTimoutLoading, setIsTimoutLoading] = useState(false);

  //website list
  const {data, isLoading, isSuccess, refetch} = useQuery(
    [keyTypes.WEB_LIST, params?.device_id],
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
    ({data_url, data_status, data_device_id, data_timer}) =>
      webCreateApi(data_url, data_status, data_device_id, data_timer),
  );

  //website update
  const mutationUpdate = useMutation(
    ({data_web_id, data_status, data_url, data_timer}) =>
      webUpdateApi(data_web_id, data_status, data_url, data_timer),
  );

  const onRefresh = async () => {
    await queryClient.removeQueries([keyTypes.WEB_LIST, params?.device_id], {
      exact: true,
    });
    await refetch();
  };

  const websiteList = useMemo(() => {
    let tmpList = [];
    if (textSearch === '') {
      tmpList = [];
    }
    if (isSuccess) {
      let listWebsite = data?.data;
      const regex = new RegExp(`${textSearch.trim()}`, 'i');
      tmpList = listWebsite?.filter(
        obj => obj?.name.search(regex) >= 0 || obj?.url.search(regex) >= 0,
      );
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
      setDebounceTextSearch(!debounceTextSearch);
    }, 300);
  };

  const handleWebCreate = timeList => {
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
      setVisibleModal(false);
      setErrors({...errors, url: validation.errors.first('url')});
    }
    mutationCreate
      .mutateAsync({
        data_url: url,
        data_status: activeRadio ? ONE : ZERO,
        data_device_id: params?.device_id,
        data_timer: activeRadio ? timeList : null,
      })
      .then(resp => {
        if (resp?.status) {
          flashMessage.success(resp?.msg);
        } else {
          flashMessage.error(resp?.msg);
        }
        resetState();
        mutationCreate.reset();
        refetch();
      })
      .catch(err => {
        flashMessage.error(err?.msg);
        mutationCreate.reset();
      });
  };

  const handleWebUpdate = timeList => {
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
      setIsTimoutLoading(true);
    }

    mutationUpdate
      .mutateAsync({
        data_url: url,
        data_status: activeRadio ? ONE : ZERO,
        data_web_id: activeItem?.id,
        data_timer: activeRadio ? timeList : null,
      })
      .then(resp => {
        if (resp?.status) {
          refetch();
          flashMessage.success(resp?.msg);
          setTimeout(() => {
            setIsTimoutLoading(false);
          }, 100);
        } else {
          setIsTimoutLoading(false);
          flashMessage.error(resp?.msg);
        }
        resetState();
        mutationCreate.reset();
      })
      .catch(err => {
        setIsTimoutLoading(false);
        flashMessage.success(err?.msg);
        mutationCreate.reset();
      });
  };

  const resetState = () => {
    setActiveRadio(false);
    setErrors({});
    setUrl('');
    setHours(HOURS_DEFAULT);
    setMinutes(MINUTE_DEFAULT);
    setActiveItem({});
  };

  const showModalDetail = (item, t) => {
    setType(t);
    setActiveItem(item);
    setUrl(item?.url);
    setActiveRadio(item?.status);
    setVisibleModal(true);
  };
  return (
    <Background bin>
      <Suspense fallback={<></>}>
        {visibleModal && (
          <ModalCreateUpdateWebComponent
            onPressClose={() => {
              setVisibleModal(false);
              resetState();
            }}
            visible={visibleModal}
            isActive={activeRadio}
            onPressActive={() => {
              setActiveRadio(!activeRadio);
            }}
            value={url}
            onChangeValue={text => setUrl(text)}
            activeItemList={activeItem}
            onPressSubmit={list => {
              if (type === types.create.code) {
                handleWebCreate(list);
              } else {
                handleWebUpdate(list);
              }
            }}
            errors={errors}
          />
        )}
      </Suspense>
      <Loading
        isLoading={
          mutationCreate?.isLoading ||
          mutationUpdate?.isLoading ||
          isTimoutLoading
        }
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
          <Text style={styles.headerTableTitleTwo}>Sử dụng</Text>
          <Text style={styles.headerTableTitleThree}>Trạng thái</Text>
        </View>
        {isLoading ? (
          <FlatList
            initialNumToRender={10}
            data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            keyExtractor={(_, key) => key}
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
            keyExtractor={item => item?.id.toString() + item?.status}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh}
                tintColor={colors.COLOR_WHITE}
              />
            }
            renderItem={({item}) => (
              <ItemComponent
                refreshList={() => refetch()}
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
