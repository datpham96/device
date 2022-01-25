import React from 'react';
import {Provider} from 'react-redux';
// import {PersistGate} from 'redux-persist/es/integration/react';
// import {ActivityIndicator} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

import configureStore from 'src/stores';
import Navigation from './src/navigation';
import * as Validator from 'src/helpers/customs/Validator';

const {store} = configureStore;

const App = () => {
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);
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
