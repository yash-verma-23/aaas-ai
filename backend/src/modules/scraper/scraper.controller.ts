import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';
import { Public } from '../../common/decorators/public.decorator';
import { ScrapeDto } from './dto/scrape.dto';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  /**
   * Scrape data using puppeteer
   */
  @Public() // TODO: remove public
  @Post()
  async scrape(@Body() dto: ScrapeDto) {
    return await this.scraperService.scrape(dto);
  }
}
