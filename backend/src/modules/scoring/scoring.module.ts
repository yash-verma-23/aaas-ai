import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';

@Module({
  providers: [ScoringService],
  controllers: [ScoringController]
})
export class ScoringModule {}
