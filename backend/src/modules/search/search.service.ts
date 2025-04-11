import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getResponse } from '../../common/utils/response.util';
import { removeDuplicates } from '../../common/utils/array.util';

@Injectable()
export class SearchService {
  private getBaseUrl(url) {
    const match = url?.match(/^https?:\/\/[^\/]+/);
    return match ? match[0] : '';
  }

  private stripDateParts(text) {
    if (!text || typeof text !== 'string') return text;

    return (
      text
        // Remove years and date ranges (e.g., 2022, 2023-2024)
        .replace(/\b(19|20)\d{2}(\s*[-–]\s*(19|20)\d{2})?\b/g, '')
        // Remove month/year patterns (e.g., Jan 2023, March 2024)
        .replace(
          /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(19|20)\d{2}\b/gi,
          '',
        )
        // Remove date formats like 12/03/2023 or 03-2024
        .replace(/\b\d{1,2}[\/\-]\d{1,2}[\/\-](19|20)\d{2}\b/g, '')
        .replace(/\b\d{1,2}[\/\-](19|20)\d{2}\b/g, '')
        // Remove seasons + years (e.g., Spring 2024)
        .replace(/\b(Spring|Summer|Autumn|Fall|Winter)\s+(19|20)\d{2}\b/gi, '')
        // Remove year/month/day in URL paths (e.g., /2023/05/12/ or -2024-03-15)
        .replace(/\/(19|20)\d{2}(\/\d{1,2})?(\/\d{1,2})?\//g, '/')
        .replace(/[-_](19|20)\d{2}([-_]\d{1,2}){0,2}/g, '')
        // Clean up extra slashes and dashes
        .replace(/\/{2,}/g, '/')
        .replace(/--+/g, '-')
        // Clean up extra spaces
        .replace(/\s{2,}/g, ' ')
        .trim()
    );
  }

  private getPathFromUrl(url) {
    if (typeof url !== 'string') {
      return '';
    }
    const match = url.match(/^[a-zA-Z]+:\/\/[^\/]+(\/[^?#]*)?/);
    if (match && match[1]) {
      return match[1].replace(/^\/|\/$/g, '');
    }
    return '';
  }

  private cleanData(input: any) {
    return {
      url: this.getBaseUrl(input?.url?.en),
      path: this.getPathFromUrl(input?.url?.en),
      nameEn: this.stripDateParts(input?.name?.en),
      nameFr: this.stripDateParts(input?.name?.fr),
      providerEn: this.stripDateParts(input?.provider?.name?.en),
      providerFr: this.stripDateParts(input?.provider?.name?.fr),
      descriptionEn: this.stripDateParts(input?.description?.en),
      descriptionFr: this.stripDateParts(input?.description?.fr),
    };
  }

  private getCombinations(dto: any): string[] {
    const data = this.cleanData(dto);
    const {
      url,
      path,
      nameEn,
      nameFr,
      providerEn,
      providerFr,
      descriptionEn,
      descriptionFr,
    } = data;
    const queries = [
      `site:${url} ${nameEn}`,
      `site:${url} ${nameFr}`,
      `site:${url} ${providerEn}`,
      `site:${url} ${providerFr}`,
      `site:${url} ${descriptionEn}`,
      `site:${url} ${descriptionFr}`,
      `site:${url} ${path}`,

      // `${nameEn}`,
      // `${nameFr}`,
      // `${providerEn}`,
      // `${providerFr}`,
      // `${descriptionEn}`,
      // `${descriptionFr}`,
      // `${path}`,
    ];
    // console.log(queries, 'queries');
    return queries;
  }

  private async getDataFromSerp(name: string): Promise<string[]> {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        api_key:
          'ee28e9f462ee5e4b256a44692a5424d7248bd1e413a1497cebdfe42f1af6154d',
        engine: 'google',
        google_domain: 'google.ca',
        gl: 'ca',
        q: name,
      },
    });
    const items = response.data.organic_results;
    if (!items) {
      return [];
    }
    return items.map((item) => item.link) as string[];
  }

  async searchUsingSerp(dto: any) {
    const combinations = this.getCombinations(dto);
    const promises = combinations.map((name) => this.getDataFromSerp(name));
    const results = await Promise.all(promises);
    console.log('results', results);
    const formattedResults = results.flat().map((item) => item);
    const unqiueResults = removeDuplicates(formattedResults);
    return getResponse(unqiueResults);
  }
}
