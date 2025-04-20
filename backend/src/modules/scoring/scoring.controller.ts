import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScoringService } from './scoring.service';
import { CosineSimilarityDto } from './dto/cosine-similarity.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('scorings')
@Controller('scorings')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Public()
  @Post('cosine-similarity')
  @ApiOperation({ summary: 'Calculate cosine similarity between two texts' })
  async getCosineSimilarity(@Body() body: CosineSimilarityDto) {
    return await this.scoringService.getCosineSimilarity(
      body.textA,
      body.textB,
    );
  }
}
