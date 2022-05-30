import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './Stacks';
import {navigationRef, isReadyRef} from './RootNavigation';
import {getKeyChain} from 'storages';
import {useDispatch} from 'react-redux';
import {userInfoRequest} from 'actions/userActions';
import SplashScreen from 'react-native-splash-screen';

function Navigation() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    async function authCheckUserInfo() {
      let respKeyChain = await getKeyChain();
      let token = respKeyChain?.password;
      if (token) {
        dispatch(userInfoRequest());
      } else {
        SplashScreen.hide();
      }
    }
    authCheckUserInfo();
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
