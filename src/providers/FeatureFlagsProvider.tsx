'use client';

import { createContext, useContext, ReactNode } from 'react';

interface FeatureFlags {
  cartEnabled: boolean;
  ordersEnabled: boolean;
}

const FeatureFlagsContext = createContext<FeatureFlags>({
  cartEnabled: true,
  ordersEnabled: true,
});

export function FeatureFlagsProvider({
  children,
}: {
  children: ReactNode;
  initialFlags?: FeatureFlags;
}) {
  return (
    <FeatureFlagsContext.Provider value={{ cartEnabled: true, ordersEnabled: true }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FeatureFlagsContext);
}
