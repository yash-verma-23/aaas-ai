import { IsNotEmpty, IsString } from 'class-validator';

export class ScrapeDto {
  /**
   * Link to scrape data from
   * @example "https://example.com"
   */
  @IsString()
  @IsNotEmpty()
  link: string;
}
