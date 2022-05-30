/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, TouchableOpacity, Animated, Easing} from 'react-native';
//node_modules
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
//api
//base
import {Text} from 'base';
//components
//config
import {colors, commonStyles, fonts, sizes} from 'styles';
import images from 'images';
import metrics from 'metrics';
//helpers
//HOC
//hooks
//navigation
import navigationTypes from 'navigationTypes';
//storages
//redux-stores
//feature
import {
  AccountScreen,
  ChildrenManagerScreen,
  HomeScreen,
  LocationScreen,
} from 'features';
//code-splitting
//screen

const Tab = createBottomTabNavigator();
const MAPABLE = [0, 1, 2, 3];
const COLOR_GRADIENT = ['#298DC6', '#475DDF', '#471BC1'];

const MyTabBar = ({state, descriptors, navigation}) => {
  const [activeRouteTab, setActiveRouteTab] = React.useState(
    navigationTypes.home.screen,
  );

  let spinValue = {};
  MAPABLE.forEach((_, key) => {
    spinValue[key] = new Animated.Value(sizes.ZERO);
  });

  React.useEffect(() => {
    switch (activeRouteTab) {
      case navigationTypes.home.screen:
        spin(sizes.ZERO);
        break;
      case navigationTypes.childrenManager.screen:
        spin(sizes.SIZE_1);
        break;
      case navigationTypes.location.screen:
        spin(sizes.SIZE_2);
        break;
      case navigationTypes.account.screen:
        spin(sizes.SIZE_3);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRouteTab]);

  function spin(index) {
    spinValue[index].setValue(sizes.ZERO);
    Animated.timing(spinValue[index], {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  let rotate = {};

  MAPABLE.forEach((_, key) => {
    rotate[key] = spinValue[key].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  });

  return (
    <LinearGradient colors={COLOR_GRADIENT} style={styles.containerTabBar}>
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
            setActiveRouteTab(route.name);
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
            <Animated.Image
              style={[
                styles.btIcon,
                {
                  transform: [
                    {
                      rotateY: rotate[index],
                    },
                  ],
                  tintColor: isFocused
                    ? colors.COLOR_WHITE
                    : colors.COLOR_WHITE,
                  opacity: isFocused ? sizes.SIZE_1 : 0.65,
                },
              ]}
              source={icon}
            />
            <Text
              style={[
                styles.labelBottomTab,
                {
                  color: isFocused ? colors.COLOR_WHITE : colors.COLOR_WHITE,
                  fontFamily: isFocused
                    ? fonts.lexendDeca.FONT_BOLD
                    : fonts.lexendDeca.FONT_REGULAR,
                  opacity: isFocused ? sizes.SIZE_1 : 0.65,
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

const tabOptions = {
  headerShown: false,
};

const BottomTabs = () => {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        options={tabOptions}
        name={navigationTypes.home.screen}
        component={HomeScreen}
      />
      <Tab.Screen
        options={tabOptions}
        name={navigationTypes.childrenManager.screen}
        component={ChildrenManagerScreen}
      />
      <Tab.Screen
        options={tabOptions}
        name={navigationTypes.location.screen}
        component={LocationScreen}
      />
      <Tab.Screen
        options={tabOptions}
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
