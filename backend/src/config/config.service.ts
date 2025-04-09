import * as dotenv from 'dotenv';

dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwError = true): string {
    let value = this.env[key];
    if (value === undefined && throwError) {
      throw new Error(`config error - missing env.${key}`);
    }
    if (!value) value = '';
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k));
    return this;
  }

  // Everything returned from env is a string. This function return a boolean for strings "true" and "false"
  public getBooleanFromString(booleanString: string) {
    if (booleanString === 'false') return false;
    else if (booleanString === 'true') return true;
    else {
      throw new Error(
        `Boolean string expected while trying to convert ${booleanString}`,
      );
    }
  }
}

const configService = new ConfigService(process.env);

export { configService };
