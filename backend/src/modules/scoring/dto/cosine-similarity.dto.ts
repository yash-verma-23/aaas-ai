import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CosineSimilarityDto {
  @ApiProperty({ example: 'I love AI and machine learning' })
  @IsString()
  textA: string;

  @ApiProperty({ example: 'Deep learning is a subset of AI' })
  @IsString()
  textB: string;
}
