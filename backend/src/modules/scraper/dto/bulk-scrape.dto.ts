import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BulkScrapeDto {
  /**
   * Whether to clean the scraped data or not
   * @example false
   */
  @ApiPropertyOptional()
  @IsBoolean()
  cleanData: boolean = false;

  /**
   * Links to scrape data from
   * @example ["https://example.com"]
   */
  @IsString()
  @IsNotEmpty()
  links: string[];
}
