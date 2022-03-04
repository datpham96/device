import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
// import {PersistGate} from 'redux-persist/es/integration/react';
import {
  BackHandler,
  Alert,
  Linking,
  Text,
  TextInput,
  LogBox,
} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

import configureStore from 'src/stores';
import Navigation from './src/navigation';
import {checkVar} from 'src/helpers/funcs';
import VersionCheck from 'react-native-version-check';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Validator from 'src/helpers/customs/Validator';

const {store} = configureStore;

//fix text not scale
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const App = () => {
  useEffect(() => {
    //remove warning
    LogBox.ignoreLogs([
      'DatePickerIOS has been merged with DatePickerAndroid and will be removed in a future release.',
      'StatusBarIOS has been merged with StatusBar and will be removed in a future release.',
      'DatePickerAndroid has been merged with DatePickerIOS and will be removed in a future release.',
      'No info about this app.',
    ]);
    checkVersion();
  }, []);
  //check version update app
  async function checkVersion() {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (!checkVar.isEmpty(updateNeeded) && updateNeeded.isNeeded) {
        Alert.alert(
          'Vui lòng cập nhật',
          'Bạn phải cập nhật ứng dụng của mình lên phiên bản mới nhất để tiếp tục sử dụng.',
          [
            {
              text: 'Cập nhật',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    } catch (error) {
      // showNotify('Đã xảy ra lỗi! Vui lòng thử lại.');
    }
  }
  return (
    <Provider store={store}>
      {/* <PersistGate loading={<ActivityIndicator />} persistor={persistor}> */}
      <QueryClientProvider client={queryClient}>
        <Navigation />
      </QueryClientProvider>
      {/* </PersistGate> */}
    </Provider>
  );
};

export default App;
