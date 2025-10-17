import React, { createContext, ReactNode, useMemo, use } from 'react';

interface RuntimePlatformContextType {
  platform?: string;
  isNative: boolean;
}

const RuntimePlatformContextProvider = createContext<RuntimePlatformContextType | undefined>(undefined);

export const RuntimePlatformContext: React.FC<{ children: ReactNode; platform?: string }> = ({
  children,
  platform,
}) => {
  const isNative = useMemo(() => {
    return platform === 'ios' || platform === 'android';
  }, [platform]);

  return (
    <RuntimePlatformContextProvider value={{ platform, isNative }}>
      {children}
    </RuntimePlatformContextProvider>
  );
};

export const withRuntimePlatform = (Component: React.FC, options: { platform: string }) => {
  return (props: any) => (
    <RuntimePlatformContext platform={options.platform}>
      <Component {...props} />
    </RuntimePlatformContext>
  );
};

export const useRuntimePlatform = (): RuntimePlatformContextType => {
  const context = use(RuntimePlatformContextProvider);
  if (context === undefined) {
    // return { platform: 'web', isNative: false };
    throw new Error('useRuntimePlatform must be used within a RuntimePlatformProvider');
  }
  return context;
};
