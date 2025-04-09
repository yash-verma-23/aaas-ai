import { loadEnvFromSecretsManager } from './config/secrets-manager';

void loadEnvFromSecretsManager().then(() => {
  void import('./app').then(({ bootstrap }) => {
    void bootstrap();
  });
});
