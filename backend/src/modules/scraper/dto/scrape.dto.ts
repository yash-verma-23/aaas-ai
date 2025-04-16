import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TransformToBoolean } from '../../../common/decorators/transform-to-boolean.decorator';

export class ScrapeDto {
  /**
   * Link to scrape data from
   * @example "https://example.com"
   */
  @IsString()
  @IsNotEmpty()
  link: string;

  /**
   * Whether to clean the scraped data or not
   * @example false
   */
  @ApiPropertyOptional()
  @TransformToBoolean()
  cleanData: boolean = false;
}
