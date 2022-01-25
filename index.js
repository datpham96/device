import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App.js';
import {name as appName} from './app.json';
import {enableScreens} from 'react-native-screens';
enableScreens(false);

AppRegistry.registerComponent(appName, () => App);
