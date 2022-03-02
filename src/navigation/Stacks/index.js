import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ErrorScreen,
  LoginScreen,
  OtpScreen,
  RegisterScreen,
  WebsiteControlScreen,
  ChildrenInfoScreen,
  NewPasswordScreen,
  FogotPasswordScreen,
  OtpNewPasswordScreen,
  DisconnectScreen,
  StatusSuccesScreen,
  DeviceInfoScreen,
  ReportScreen,
  Error401Screen,
  ApplicationControlScreen,
  AccountScreen,
  ActivatedScreen,
  ImeiScreen,
} from '../../features';
import navigationTypes from '../types';
import BottomTabs from '../BottomTabs';
import {useSelector} from 'react-redux';
import {Platform} from 'react-native';

const RootNavStack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  animationEnabled: Platform.OS === 'android' ? false : true,
};

const RootStack = () => {
  const logged = useSelector(state => state.auth.logged);
  return (
    <RootNavStack.Navigator>
      {logged ? (
        <>
          <RootNavStack.Screen
            name={navigationTypes.bottomTabs.screen}
            component={BottomTabs}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.websiteControl.screen}
            component={WebsiteControlScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.applicationControl.screen}
            component={ApplicationControlScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.childrenInfo.screen}
            component={ChildrenInfoScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.newPassword.screen}
            component={NewPasswordScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.deviceInfo.screen}
            component={DeviceInfoScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.account.screen}
            component={AccountScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.error401.screen}
            component={Error401Screen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.activated.screen}
            component={ActivatedScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.imei.screen}
            component={ImeiScreen}
            options={screenOptions}
          />
        </>
      ) : (
        <>
          <RootNavStack.Screen
            name={navigationTypes.login.screen}
            component={LoginScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.register.screen}
            component={RegisterScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.fogotPassword.screen}
            component={FogotPasswordScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.otp.screen}
            component={OtpScreen}
            options={screenOptions}
          />
          <RootNavStack.Screen
            name={navigationTypes.otpNewPassword.screen}
            component={OtpNewPasswordScreen}
            options={screenOptions}
          />
        </>
      )}
      {/* <RootNavStack.Screen
        name={navigationTypes.login.screen}
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      /> */}
      <RootNavStack.Screen
        name={navigationTypes.error.screen}
        component={ErrorScreen}
        options={screenOptions}
      />
      <RootNavStack.Screen
        name={navigationTypes.disconnect.screen}
        component={DisconnectScreen}
        options={screenOptions}
      />
      <RootNavStack.Screen
        name={navigationTypes.statusSuccess.screen}
        component={StatusSuccesScreen}
        options={screenOptions}
      />
      <RootNavStack.Screen
        name={navigationTypes.report.screen}
        component={ReportScreen}
        options={screenOptions}
      />
    </RootNavStack.Navigator>
  );
};

export default RootStack;
