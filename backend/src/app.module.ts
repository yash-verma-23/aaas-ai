import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
