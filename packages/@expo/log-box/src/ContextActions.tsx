import React, { createContext, ReactNode, use } from 'react';

interface ActionsContextType {
  onMinimize: (() => void) | undefined;
}

const ActionsContextProvider = createContext<ActionsContextType>({
  onMinimize: () => {},
});

export const ActionsContext: React.FC<{ children: ReactNode } & ActionsContextType> = ({
  children,
  onMinimize,
}) => {
  return <ActionsContextProvider value={{ onMinimize }}>{children}</ActionsContextProvider>;
};

export const withActions = (Component: React.FC, actions: ActionsContextType) => {
  return (props: any) => (
    <ActionsContext {...actions}>
      <Component {...props} />
    </ActionsContext>
  );
};

export const useActions = (): ActionsContextType => {
  const context = use(ActionsContextProvider);
  if (context === undefined) {
    throw new Error('useActions must be used within an ActionsProvider');
  }
  return context;
};
