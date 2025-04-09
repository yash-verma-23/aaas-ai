import { configService } from '../../config/config.service';
import { NodeEnvEnum } from '../enums/node-env.enum';

export const isLocalEnv = () => {
  return configService.getValue('NODE_ENV') === NodeEnvEnum.Local;
};

export const isTestEnv = () => {
  return configService.getValue('NODE_ENV') === NodeEnvEnum.Test;
};

export const isLocalOrTestEnv = () => {
  return isLocalEnv() || isTestEnv();
};

export const isStagingEnv = () => {
  return configService.getValue('NODE_ENV') === NodeEnvEnum.Staging;
};

export const isProductionEnv = () => {
  return configService.getValue('NODE_ENV') === NodeEnvEnum.Production;
};

export const isStagingOrProductionEnv = () => {
  return isStagingEnv() || isProductionEnv();
};
