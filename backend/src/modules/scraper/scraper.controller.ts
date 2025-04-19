import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';
import { Public } from '../../common/decorators/public.decorator';
import { ScrapeDto } from './dto/scrape.dto';
import { BulkScrapeDto } from './dto/bulk-scrape.dto';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  /**
   * Scrape data using puppeteer
   */
  @Public() // TODO: remove public
  @Post('puppeteer')
  async scrapeUsingPuppeteer(@Body() dto: ScrapeDto) {
    return await this.scraperService.scrapeUsingPuppeteer(dto);
  }

  /**
   * Scrape data using scaper API
   */
  @Public() // TODO: remove public
  @Post('scraper-api')
  async scrapeUsingScraperApi(@Body() dto: ScrapeDto) {
    return await this.scraperService.scrapeUsingScraperApi(dto);
  }

  /**
   * Bulk Scrape data using scaper API
   */
  @Public() // TODO: remove public
  @Post('scraper-api-bulk')
  async bulkScrapeUsingScraperApi(@Body() dto: BulkScrapeDto) {
    return await this.scraperService.bulkScrapeUsingScraperApi(dto);
  }
}
