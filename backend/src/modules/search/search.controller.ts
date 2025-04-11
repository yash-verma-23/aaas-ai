import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public() // TODO: remove public
  @Post('serp')
  async scrapeUsingPuppeteer(@Body() dto: any) {
    return await this.searchService.searchUsingSerp(dto);
  }
}
