/**
 * @format
 */
import 'react-native-url-polyfill/auto';
import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';

LogBox.ignoreAllLogs();
const originalConsoleError = console.error;
console.error = (...args) => {
    console.log("MY_CRITICAL_CONSOLE_ERROR:", ...args);
    originalConsoleError(...args);
};

const defaultHandler = global.ErrorUtils.getGlobalHandler();
global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.log("MY_CRITICAL_GLOBAL_ERROR_MESSAGE:", error);
    defaultHandler(error, isFatal);
});

const App = require('./App').default;

AppRegistry.registerComponent(appName, () => App);
