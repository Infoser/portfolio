export type FeatureFlags = {
  bugCounter: boolean;
  debugTerminal: boolean;
  sessionTracker: boolean;
};

export const FEATURE_FLAGS: FeatureFlags = {
  bugCounter: true,
  debugTerminal: true,
  sessionTracker: true,
};

export const isFeatureEnabled = (key: keyof FeatureFlags): boolean => FEATURE_FLAGS[key];
