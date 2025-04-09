import { Injectable } from '@nestjs/common';
import { ScrapeDto } from './dto/scrape.dto';
import puppeteer from 'puppeteer';
import { getResponse } from '../../common/utils/response.util';

@Injectable()
export class ScraperService {
  private async handleScrapeData(link: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'domcontentloaded' });
    await this.delay(3000); // Let initial content load

    // Expand all accordion items
    await page.evaluate(async () => {
      const items = document.querySelectorAll('.accordion-item');
      for (const item of items) {
        const toggle: any = item.querySelector(
          'button, .accordion-toggle, .accordion-header',
        );
        const content = item.querySelector('.accordion-item__dropdown');
        if (
          toggle &&
          content &&
          content.getAttribute('aria-hidden') !== 'false'
        ) {
          toggle.click();
          await this.delay(500);
        }
      }
    });

    await this.delay(2000); // Wait after all expands

    // Get full text content including hidden text
    const fullText = await page.evaluate(() => {
      const getAllText = (element) => {
        let text = '';
        for (const node of element.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent + '\n';
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            text += getAllText(node);
          }
        }
        return text;
      };
      return getAllText(document.body);
    });
    await browser.close();
    return fullText;
  }

  private delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async scrape(dto: ScrapeDto) {
    const { links } = dto;
    const promises = links.map((link) => this.handleScrapeData(link));
    const responses = await Promise.all(promises);
    return getResponse(responses);
  }
}
