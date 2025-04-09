import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export class ScrapeDto {
  /**
   * Links to scrape data from
   * @example ["https://example.com"]
   */
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  links: string[];
}
