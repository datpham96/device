/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  LayoutAnimation,
} from 'react-native';
import {Text} from 'base';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, commonStyles, fonts, sizes} from 'styles';
import Switch from './SwitchComponent';
import ItemChildrenSafe from './ItemChildrenSafeComponent';
import types from '../types';
import {PopupConfirm} from 'components';
import {useMutation, useQuery} from 'react-query';
import {deviceSettingListApi, deviceSettingUpdateApi} from 'methods/device';
import keyTypes from 'keyTypes';
import {Toast} from 'customs';
import {checkVar} from 'src/helpers/funcs';

const SafeComponent = ({deviceId}) => {
  const [expanded, setExpanded] = useState({});
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [itemUpdate, setItemUpdate] = useState({});
  const [toggleSwitch, setToggleSwitch] = useState({});

  const {data, refetch, isSuccess} = useQuery(
    [keyTypes.DEVICE_SETTING_LIST, deviceId],
    () => deviceSettingListApi(deviceId),
    {
      keepPreviousData: true,
    },
  );

  const mutationDeviceSettingUpdate = useMutation(
    ({data_device_id, data_name, data_status}) =>
      deviceSettingUpdateApi(data_device_id, data_name, data_status),
  );

  //format active Switch
  useEffect(() => {
    if (data) {
      let objItemSwitchByKey = {};
      data?.data.map(item => {
        objItemSwitchByKey[item?.name] = {
          switch: item?.status ? true : false,
        };
        if (!checkVar.isEmpty(item?.children)) {
          item?.children.map(itemChildren => {
            objItemSwitchByKey[item?.name].children = {
              ...objItemSwitchByKey[item?.name].children,
              [itemChildren?.name]: {
                switch: itemChildren?.status ? true : false,
              },
            };
          });
        }
      });
      setToggleSwitch(objItemSwitchByKey);
    }
  }, [data]);

  //format toggle expanded item children
  useEffect(() => {
    if (data) {
      let objItemExpandedByKey = {};
      data?.data.map((_, key) => {
        objItemExpandedByKey[key] = false;
      });
      setExpanded(objItemExpandedByKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleAgreeSettingDevice = () => {
    setVisibleConfirm(false);
    // let params = {};
    // switch (settingType) {
    //   case types.safe_web.code:
    //     if (infoSafeWeb) {
    //       params.data_device_id = deviceId;
    //       params.data_name = types.safe_web.code;
    //       params.data_status = enableSafeWeb ? 1 : 0;
    //     } else {
    //       params.data_device_id = deviceId;
    //       params.data_name = types.safe_web.code;
    //       params.data_status = 0;
    //     }
    //     break;
    //   case types.safe_search.code:
    //     if (infoSafeSearch) {
    //       params.data_device_id = deviceId;
    //       params.data_name = types.safe_search.code;
    //       params.data_status = enableSafeSearch ? 1 : 0;
    //     } else {
    //       params.data_device_id = deviceId;
    //       params.data_name = types.safe_search.code;
    //       params.data_status = 0;
    //     }
    //     break;
    // }
    let params = {
      data_device_id: itemUpdate?.device_id,
      data_name: itemUpdate?.name,
      data_status: itemUpdate?.status ? 0 : 1,
    };

    mutationDeviceSettingUpdate
      .mutateAsync(params)
      .then(resp => {
        if (resp?.status) {
          Toast('Thiết lập thành công');
          refetch();
        } else {
          Toast('Thiết lập không thành công');
        }
        mutationDeviceSettingUpdate.reset();
      })
      .catch(() => {
        Toast('Thiết lập không thành công');
        mutationDeviceSettingUpdate.reset();
      });
  };

  const toggleExpand = key => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded({...expanded, [key]: !expanded?.[key]});
  };

  const loadIconItem = type => {
    switch (type) {
      case types.safe_web.code:
        return types.safe_web.icon;
      case types.safe_search.code:
        return types.safe_search.icon;
      case types.safe_web.children.safe_web_ads.code:
        return types.safe_web.children.safe_web_ads.icon;
      case types.safe_web.children.safe_web_gamble.code:
        return types.safe_web.children.safe_web_gamble.icon;
      case types.safe_web.children.safe_web_sex.code:
        return types.safe_web.children.safe_web_sex.icon;
    }
  };

  //xu ly on/off btn switch item parent
  const handleToggleSwitchParent = dataItem => {
    setToggleSwitch(prevState => ({
      ...prevState,
      [dataItem?.name]: {
        ...prevState[dataItem?.name],
        switch: !prevState[dataItem?.name].switch,
      },
    }));
    setItemUpdate(dataItem);
    setVisibleConfirm(true);
  };

  //xu ly on/off btn switch item children
  const handleToggleSwitchChildren = (dataParent, dataChildren) => {
    setToggleSwitch(prevState => ({
      ...prevState,
      [dataParent?.name]: {
        ...prevState[dataParent?.name],
        children: {
          ...prevState[dataParent?.name]?.children,
          [dataChildren?.name]: {
            ...prevState[dataParent?.name]?.children?.[dataChildren?.name],
            switch:
              !prevState[dataParent?.name]?.children?.[dataChildren?.name]
                ?.switch,
          },
        },
      },
    }));
    setItemUpdate(dataChildren);
    setVisibleConfirm(true);
  };

  //xu ly on/off popup confirm
  const handleCancelSettingDevice = () => {
    setVisibleConfirm(false);
    if (!checkVar.isEmpty(itemUpdate)) {
      if (itemUpdate?.parent_name) {
        setToggleSwitch(prevState => ({
          ...prevState,
          [itemUpdate?.parent_name]: {
            ...prevState[itemUpdate?.parent_name],
            children: {
              ...prevState[itemUpdate?.parent_name]?.children,
              [itemUpdate?.name]: {
                ...prevState[itemUpdate?.parent_name]?.children?.[
                  itemUpdate?.name
                ],
                switch:
                  !prevState[itemUpdate?.parent_name]?.children?.[
                    itemUpdate?.name
                  ]?.switch,
              },
            },
          },
        }));
      } else {
        setToggleSwitch(prevState => ({
          ...prevState,
          [itemUpdate?.name]: {
            ...prevState[itemUpdate?.name],
            switch: !prevState[itemUpdate?.name].switch,
          },
        }));
      }
    }
  };

  return (
    <View style={styles.settingContainer}>
      <PopupConfirm
        onPressAgree={handleAgreeSettingDevice}
        onPressCancel={handleCancelSettingDevice}
        visible={visibleConfirm}
        content="Bạn có muốn thực hiện tác vụ này không?"
      />
      {data?.data.map((item, key) => {
        return (
          <View key={key}>
            <TouchableOpacity
              disabled={checkVar.isEmpty(item?.children)}
              activeOpacity={0.9}
              onPress={() => toggleExpand(key)}
              style={[
                styles.wrapSafeWeb,
                expanded?.[key] ? {} : {marginBottom: sizes.SIZE_20},
              ]}>
              <View style={styles.headerSafeWeb}>
                <FastImage
                  style={styles.iconInfo}
                  source={loadIconItem(item?.name)}
                />
                <View style={styles.wrapContentSafeWeb}>
                  <Text style={styles.labelInfoWithChildren}>
                    {item?.description}
                  </Text>
                  {!checkVar.isEmpty(item?.children) && (
                    <MaterialCommunityIcons
                      name={expanded?.[key] ? 'chevron-down' : 'chevron-up'}
                      color={colors.COLOR_WHITE}
                      size={sizes.SIZE_20}
                    />
                  )}
                </View>
                <Switch
                  value={toggleSwitch?.[item?.name]?.switch}
                  onValueChange={() => handleToggleSwitchParent(item)}
                  containerStyle={styles.switchSafeWeb}
                />
              </View>
              <Text style={styles.contentSafeWeb}>{item?.content}</Text>
            </TouchableOpacity>
            {expanded?.[key] && !checkVar.isEmpty(item?.children) && (
              <View
                style={[
                  styles.wrapChildrenSafe,
                  toggleSwitch?.[item?.name]?.switch ? {} : {opacity: 0.6},
                ]}
                pointerEvents={
                  toggleSwitch?.[item?.name]?.switch ? 'auto' : 'none'
                }>
                <View style={styles.verticalBar} />
                <View style={styles.wrapChildrenItem}>
                  {item?.children.map((itemChildren, keyChildren) => {
                    return (
                      <View key={keyChildren}>
                        <ItemChildrenSafe
                          containerStyle={
                            toggleSwitch?.[item?.name]?.switch &&
                            itemChildren?.name ===
                              types.safe_web.children.safe_web_ads.code
                              ? {opacity: 0.6}
                              : {}
                          }
                          pointerEvents={
                            toggleSwitch?.[item?.name]?.switch &&
                            itemChildren?.name ===
                              types.safe_web.children.safe_web_ads.code
                              ? 'none'
                              : 'auto'
                          }
                          value={
                            toggleSwitch?.[item?.name]?.children?.[
                              itemChildren?.name
                            ]?.switch
                          }
                          toggleSwitch={() =>
                            handleToggleSwitchChildren(item, itemChildren)
                          }
                          content={itemChildren?.description}
                          srcImage={loadIconItem(itemChildren?.name)}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  settingContainer: {
    marginTop: sizes.SIZE_10,
    paddingVertical: sizes.SIZE_10,
  },
  wrapContentSafeWeb: {
    ...commonStyles.flexRowCenter,
    ...commonStyles.flex1,
  },
  wrapSafeWeb: {
    // ...commonStyles.flexRowCenter,
    // marginBottom: sizes.SIZE_20,
  },
  wrapSafeSearch: {
    // ...commonStyles.flexRowCenter,
    marginVertical: sizes.SIZE_15,
  },
  headerSafeWeb: {
    ...commonStyles.flexRowCenter,
    justifyContent: 'space-between',
  },
  switchSafeWeb: {
    alignSelf: 'center',
  },
  contentSafeWeb: {
    marginTop: sizes.SIZE_5,
    textAlign: 'justify',
    fontSize: sizes.SIZE_12,
    fontFamily: fonts.lexendDeca.FONT_LIGHT,
  },
  iconInfo: {
    width: sizes.SIZE_40,
    height: sizes.SIZE_40,
  },
  labelInfoWithChildren: {
    fontFamily: fonts.lexendDeca.FONT_MEDIUM,
    fontSize: sizes.SIZE_14,
    paddingHorizontal: sizes.SIZE_10,
  },
  labelInfo: {
    fontFamily: fonts.lexendDeca.FONT_MEDIUM,
    fontSize: sizes.SIZE_14,
    ...commonStyles.flex1,
    paddingHorizontal: sizes.SIZE_10,
  },
  lineOne: {
    marginVertical: sizes.SIZE_20,
  },

  wrapChildrenSafe: {
    marginTop: sizes.SIZE_5,
    ...commonStyles.flexRowCenter,
    marginBottom: sizes.SIZE_20,
  },
  verticalBar: {
    width: sizes.SIZE_3,
    backgroundColor: colors.COLOR_WHITE,
    height: '90%',
    borderRadius: sizes.SIZE_5,
  },
  wrapChildrenItem: {
    flex: 1,
    marginLeft: sizes.SIZE_15,
  },
});

export default React.memo(SafeComponent);
