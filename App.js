import React from 'react';
import {Provider} from 'react-redux';
// import {PersistGate} from 'redux-persist/es/integration/react';
import {BackHandler, Alert, Linking} from 'react-native';
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

const App = () => {
  React.useEffect(() => {
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
