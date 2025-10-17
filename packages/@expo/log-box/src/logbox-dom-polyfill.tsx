'use dom';

import React from 'react';

import { ActionsContext } from './ContextActions';
import { RuntimePlatformContext } from './ContextPlatform';
import * as LogBoxData from './Data/LogBoxData';
import { LogBoxLog, LogContext } from './Data/LogBoxLog';
import { LogBoxInspectorContainer } from './overlay/Overlay';
import { convertNativeToExpoLogBoxLog, convertToExpoLogBoxLog } from './utils/convertLogBoxLog';

export default function LogBoxPolyfillDOM({
  onMinimize,
  onCopyText,
  platform,
  fetchJsonAsync,
  reloadRuntime,
  ...props
}: {
  onCopyText?: (text: string) => void;
  fetchJsonAsync?: (
    input: string,
    init?: {
      method?: string;
      body?: string;
    }
  ) => Promise<any>;
  reloadRuntime?: () => void;
  platform?: string;
  devServerUrl?: string;
  onDismiss?: (index: number) => void;
  onMinimize?: () => void;
  onChangeSelectedIndex?: (index: number) => void;
  /**
   * LobBoxLogs from the JS Runtime
   */
  logs?: any[];
  /**
   * Logs from the native runtime (both native and JS, both iOS and Android, e.g. redbox errors)
   */
  nativeLogs?: any[];
  selectedIndex?: number;
  dom?: import('expo/dom/internal').DOMPropsInternal;
}) {
  const logs = React.useMemo(() => {
    return [
      // Convert from React Native style to Expo style LogBoxLog
      ...(props.logs ?? []).map(convertToExpoLogBoxLog),
      // Convert native logs to Expo Log Box format
      ...(props.nativeLogs ?? []).map(convertNativeToExpoLogBoxLog(platform)), // TODO: use EXPO_DOM_HOST_OS
    ];
  }, [props.logs, props.nativeLogs, platform]);
  const selectedIndex = props.selectedIndex ?? (logs && logs?.length - 1) ?? -1;

  // @ts-ignore
  globalThis.__polyfill_onCopyText = onCopyText;
  // @ts-ignore
  globalThis.__polyfill_platform = platform;

  if (fetchJsonAsync) {
    // @ts-ignore
    globalThis.__polyfill_dom_fetchJsonAsync = async (
      url: string,
      options?: {
        method?: string;
        body?: string;
      }
    ) => {
      const response = await fetchJsonAsync(url, options);
      return JSON.parse(response);
    };
    // @ts-ignore
    globalThis.__polyfill_dom_fetchAsync = async (
      url: string,
      options?: {
        method?: string;
        body?: string;
      }
    ) => {
      return await fetchJsonAsync(url, options);
    };
  }
  // @ts-ignore
  globalThis.__polyfill_dom_reloadRuntime = reloadRuntime;
  useViewportMeta('width=device-width, initial-scale=1, viewport-fit=cover');
  useExpoDevServerOriginPolyfill(props);
  useNativeLogBoxDataPolyfill({ logs }, props);

  return (
    <LogContext
      value={{
        selectedLogIndex: selectedIndex,
        isDisabled: false,
        logs,
      }}>
      <RuntimePlatformContext platform={platform}>
        <ActionsContext onMinimize={onMinimize}>
          <LogBoxInspectorContainer />
        </ActionsContext>
      </RuntimePlatformContext>
    </LogContext>
  );
}

function useExpoDevServerOriginPolyfill({
  devServerUrl,
}: {
  devServerUrl?: string;
}) {
  if (!devServerUrl) {
    return;
  }

  globalThis.process = globalThis.process || {};
  globalThis.process.env = {
    ...globalThis.process.env,
    EXPO_DEV_SERVER_ORIGIN: devServerUrl,
  };
}

function useNativeLogBoxDataPolyfill(
  {
    logs,
  }: {
    logs: LogBoxLog[];
  },
  polyfill: {
    onChangeSelectedIndex?: (index: number) => void;
    onDismiss?: (index: number) => void;
  }
) {
  // @ts-ignore
  // eslint-disable-next-line import/namespace
  LogBoxData.setSelectedLog = polyfill.onChangeSelectedIndex;

  // @ts-ignore
  // eslint-disable-next-line import/namespace
  LogBoxData.dismiss = (log: LogBoxLog) => {
    const index = logs.indexOf(log);
    polyfill.onDismiss?.(index);
  };
}

function useViewportMeta(content: string) {
  React.useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');

    if (!meta) {
      meta = document.createElement('meta');
      // @ts-ignore
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  }, [content]);
}
