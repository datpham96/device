import React from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Text} from 'base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import LinearGradient from 'react-native-linear-gradient';

import {
  AccountScreen,
  ChildrenManagerScreen,
  HomeScreen,
  LocationScreen,
} from 'features';
import navigationTypes from 'navigationTypes';
import {colors, commonStyles, fonts, sizes} from 'styles';
import images from 'images';
import metrics from 'metrics';

const MyTabBar = ({state, descriptors, navigation}) => {
  return (
    <LinearGradient
      // start={{x: 0, y: 0}}
      // end={{x: 1, y: 0}}
      colors={['#298DC6', '#475DDF', '#471BC1']}
      style={styles.containerTabBar}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        let label = route.name;
        let icon = images.icons.bt_home;
        switch (route.name) {
          case navigationTypes.home.screen:
            label = navigationTypes.home.name;
            icon = images.icons.bt_home;
            break;
          case navigationTypes.childrenManager.screen:
            label = 'Kiểm soát';
            icon = images.icons.bt_control;
            break;
          case navigationTypes.location.screen:
            label = navigationTypes.location.name;
            icon = images.icons.bt_location;
            break;
          case navigationTypes.account.screen:
            label = navigationTypes.account.name;
            icon = images.icons.bt_account;
            break;
          default:
            label = navigationTypes.home.name;
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.touchTabBar}>
            <Image
              style={[
                styles.btIcon,
                // {
                //   tintColor: isFocused
                //     ? colors.COLOR_RED_ORANGE
                //     : colors.COLOR_WHITE,
                // },
              ]}
              source={icon}
            />
            <Text
              style={[
                styles.labelBottomTab,
                {
                  // color: isFocused
                  //   ? colors.COLOR_RED_ORANGE
                  //   : colors.COLOR_WHITE,
                  fontFamily: isFocused
                    ? fonts.lexendDeca.FONT_BOLD
                    : fonts.lexendDeca.FONT_REGULAR,
                },
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      lazy={true}
      shifting={false}
      sceneAnimationEnabled={true}
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name={navigationTypes.home.screen}
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name={navigationTypes.childrenManager.screen}
        component={ChildrenManagerScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name={navigationTypes.location.screen}
        component={LocationScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name={navigationTypes.account.screen}
        component={AccountScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  barStyle: {},
  touchTabBar: {
    ...commonStyles.flex1,
    alignItems: 'center',
    paddingTop: sizes.SIZE_8,
  },
  containerTabBar: {
    flexDirection: 'row',
    height: metrics.heightBottomTab,
    // paddingBottom: isIphoneX()
    //   ? getBottomSpace()
    //   : getBottomSpace() + sizes.SIZE_10,
  },
  btIcon: {
    width: sizes.SIZE_25,
    height: sizes.SIZE_25,
    tintColor: colors.COLOR_WHITE,
  },
  labelBottomTab: {
    fontFamily: fonts.montserrat.FONT_MEDIUM,
    fontSize: sizes.SIZE_11,
    marginTop: sizes.SIZE_3,
  },
});

export default BottomTabs;
