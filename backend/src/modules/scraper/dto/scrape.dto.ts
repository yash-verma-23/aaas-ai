import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

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
  @IsBoolean()
  cleanData: boolean = false;
}
