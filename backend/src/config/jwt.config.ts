import { JwtModuleOptions } from '@nestjs/jwt';
import { configService } from './config.service';

export default async (): Promise<JwtModuleOptions> => {
  return {
    global: true,
    secret: configService.getValue('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.getValue('JWT_EXPIRY_TIME'),
    },
  };
};
