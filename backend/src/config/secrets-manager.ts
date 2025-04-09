import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

// Regex to match the format of the environment variable
// that contains the path to the secret in Secrets Manager.
//
// e.g. POSTGRES_PASSWORD=asm::/staging/backend::password
const SECRETS_MANAGER_PATTERN = /asm::(.+)::(.+)/;

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || 'ca-central-1',
});

/**
 * Load environment variables from Secrets Manager.
 * This function will replace the value of the environment variable
 * that match the pattern `asm::/secret/path::key` with the value
 * of the key `key` in the secret `/secret/path`.
 *
 * >> Assume that the secret `/staging/backend` has the following content:
 * {
 *  "username": "postgres",
 *  "password": "password"
 * }
 *
 * >> Then the following environment variables:
 * POSTGRES_USERNAME = 'asm::/staging/backend::username';
 * POSTGRES_PASSWORD = 'asm::/staging/backend::password';
 *
 * >> Will get replaced and become:
 * POSTGRES_USERNAME = 'postgres';
 * POSTGRES_PASSWORD = 'password';
 *
 * @returns {Promise<void>}
 * @throws {Error} If the secret is not found or the key is not found in the secret.
 */
export const loadEnvFromSecretsManager = async (): Promise<void> => {
  const secretsCache = new Map<string, Record<string, string>>();

  for (const key in process.env) {
    const value = process.env[key];
    if (!value) continue;

    const match = SECRETS_MANAGER_PATTERN.exec(value);

    if (match) {
      const [, secretName, secretKey] = match;

      if (!secretsCache.has(secretName)) {
        // eslint-disable-next-line no-await-in-loop
        const secrets = await getSecretsFromSecretsManager(secretName);
        secretsCache.set(secretName, secrets);
      }

      const secrets = secretsCache.get(secretName);
      if (!secrets) throw new Error(`Secrets not found for ${value}`);

      process.env[key] = secrets[secretKey];
    }
  }
};

const getSecretsFromSecretsManager = async (
  secretName: string,
): Promise<Record<string, string>> => {
  try {
    const { SecretString } = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT',
      }),
    );
    if (!SecretString) {
      throw new Error(`SecretString not found for '${secretName}'`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(SecretString);
  } catch (e: any) {
    const error = e as Error;
    error.message = `Error getting secrets from Secrets Manager for '${secretName}'\n${error.message}`;
    throw error;
  }
};
