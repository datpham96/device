import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './Stacks';
import {navigationRef, isReadyRef} from './RootNavigation';
import {getToken, getExpiredToken, removeAll, getKeyChain} from 'storages';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {userInfoRequest} from 'actions/userActions';
import SplashScreen from 'react-native-splash-screen';

function Navigation() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    async function authCheckUserInfo() {
      let respKeyChain = await getKeyChain();
      let token = respKeyChain?.password;
      // let token = await getToken();
      // let expired_token = await getExpiredToken();
      // if (
      //   token &&
      //   moment().diff(
      //     moment(expired_token, 'DD-MM-YYYY HH:mm:ss'),
      //     'days',
      //     true,
      //   ) <= 2
      // ) {
      //   dispatch(userInfoRequest());
      // } else {
      //   await removeAll();
      //   SplashScreen.hide();
      // }
      if (token) {
        dispatch(userInfoRequest());
      } else {
        SplashScreen.hide();
      }
    }
    authCheckUserInfo();

    // Unsubscribe
    // return () => {
    //   RootNavigation.isReadyRef.current = false;
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer
      onReady={() => {
        isReadyRef.current = true;
      }}
      ref={navigationRef}>
      <RootStack />
    </NavigationContainer>
  );
}

export default Navigation;
