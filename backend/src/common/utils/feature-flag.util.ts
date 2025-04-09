import { configService } from '../../config/config.service';

type FeatureFlags = 'FEATURE_FLAG_ENABLE_AI';

export const isTrue = (featureFlag: FeatureFlags) => {
  const value = configService.getValue(featureFlag);
  return configService.getBooleanFromString(value);
};
