// Based on https://github.com/facebook/react-native/blob/9ab95dd2b5746e8323ad1d65591d5a4ec7718790/packages/react-native/Libraries/Utilities/HMRClient.js

// @ts-expect-error missing types
import getDevServer from 'react-native/Libraries/Core/Devtools/getDevServer';
import LogBox from 'react-native/Libraries/LogBox/LogBox';
// @ts-expect-error missing types
import NativeRedBox from 'react-native/Libraries/NativeModules/specs/NativeRedBox';
import DevSettings from 'react-native/Libraries/Utilities/DevSettings';

export function showLoading(message: string, type: 'load' | 'refresh') {
  const DevLoadingView = require('react-native/Libraries/Utilities/DevLoadingView').default;
  DevLoadingView.showMessage(message, type);
}

export function hideLoading() {
  const DevLoadingView = require('react-native/Libraries/Utilities/DevLoadingView').default;
  DevLoadingView.hide();
}

export function resetErrorOverlay() {
  dismissRedbox();
  // @ts-expect-error clearAllLogs exists, but ts types are missing
  LogBox.clearAllLogs();
}

export function reload() {
  // @ts-expect-error missing types
  DevSettings.reload('Bundle Splitting – Metro disconnected');
}

export function getFullBundlerUrl({
  serverScheme,
  serverHost,
  bundleEntry,
  platform,
}: {
  serverScheme: string;
  serverHost: string;
  bundleEntry: string;
  platform: string;
}): string {
  return (
    getDevServer().fullBundleUrl ??
    `${serverScheme}://${serverHost}/hot?bundleEntry=${bundleEntry}&platform=${platform}`
  );
}

export function getConnectionError(serverHost: string, e: Error): string {
  let error = `Cannot connect to Metro.

Try the following to fix the issue:
- Ensure that Metro is running and available on the same network`;

  if (process.env.EXPO_OS === 'ios') {
    error += `
- Ensure that the Metro URL is correctly set in AppDelegate`;
  } else {
    error += `
- Ensure that your device/emulator is connected to your machine and has USB debugging enabled - run 'adb devices' to see a list of connected devices
- If you're on a physical device connected to the same machine, run 'adb reverse tcp:8081 tcp:8081' to forward requests from your device
- If your device is on the same Wi-Fi network, set 'Debug server host & port for device' in 'Dev settings' to your machine's IP address and the port of the local dev server - e.g. 10.0.1.1:8081`;
  }

  error += `

URL: ${serverHost}

Error: ${e.message}`;
  return error;
}

function dismissRedbox() {
  if (process.env.EXPO_OS === 'ios' && NativeRedBox != null && NativeRedBox.dismiss != null) {
    NativeRedBox.dismiss();
  } else {
    const NativeExceptionsManager =
      require('react-native/Libraries/Core/NativeExceptionsManager').default;
    NativeExceptionsManager &&
      NativeExceptionsManager.dismissRedbox &&
      NativeExceptionsManager.dismissRedbox();
  }
}
