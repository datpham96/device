import * as React from 'react';
import {StackActions} from '@react-navigation/native';

export const isReadyRef = React.createRef();
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function replace(name, params) {
  navigationRef.current?.replace(name, params);
}

export function reset(name, index = 0) {
  navigationRef.current?.reset({
    index: index,
    routes: [{name: name}],
  });
}

export function popToTop() {
  navigationRef.current?.dispatch(StackActions.popToTop());
}
// export function navigateAuth(name, params, isLogin) {
//   if (isLogin) {
//     navigationRef.current?.navigate(name, params);
//   } else {
//     navigationRef.current?.navigate('login');
//   }
// }

export function goBack() {
  if (
    isReadyRef.current &&
    navigationRef.current &&
    navigationRef.current.canGoBack()
  ) {
    navigationRef.current?.goBack();
  }
}
