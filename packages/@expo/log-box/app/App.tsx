import * as React from 'react';
import { LogBoxLog } from '../src/Data/LogBoxLog';
import { parseLogBoxException } from '../src/Data/parseLogBoxLog';
import LogBoxPolyfillDOM from '../src/logbox-dom-polyfill';
import { View, Text } from 'react-native';

const logs: LogBoxLog[] = [
  new LogBoxLog(parseLogBoxException({
    originalMessage: "Test error",
    stack: [],
  })),
];

/**
 * Empty App skeleton used as a workaround to prebuilt the Expo LogBox DOM Component.
 * (DOM Components are build during `expo export:embed`)
 *
 * Also used for the DOM Component UI preview via `yarn start`.
 */
export default function App() {
  const [showSandboxWarning, setSandboxWarningVisibility] = React.useState(true);
  return (
    <>
      { showSandboxWarning &&
        <View style={{ position: 'absolute', padding: 16, backgroundColor: '#E9D502', zIndex: 10000, borderRadius: 8, top: 16, left: 16, flexDirection: 'row', gap: 8 }}>
          <Text style={{fontFamily: "BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"}} >This is @expo/log-box development sandbox.</Text>
          <Text style={{fontWeight: 'bold'}} onPress={() => setSandboxWarningVisibility(false)}>Close</Text>
        </View>
      }
      <LogBoxPolyfillDOM
        platform={process.env.EXPO_OS}
        logs={logs}
        dom={{}}
        fetchJsonAsync={() => Promise.reject(new Error('`fetchJsonAsync` placeholder, should never be called.'))}
        reloadRuntime={() => { throw new Error('`reloadRuntime` placeholder, should never be called.'); }}
        onCopyText={() => { throw new Error('`onCopyText` placeholder, should never be called.'); }}
        onDismiss={() => { throw new Error("`onDismiss` placeholder, should never be called."); }}
        onMinimize={() => { throw new Error("`onMinimize` placeholder, should never be called."); }}
        onChangeSelectedIndex={() => { throw new Error("`onChangeSelectedIndex` placeholder, should never be called."); }}
      />
    </>
  );
}
