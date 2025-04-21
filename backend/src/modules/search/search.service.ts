import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getResponse } from '../../common/utils/response.util';
import { removeDuplicates } from '../../common/utils/array.util';

@Injectable()
export class SearchService {
  private getRootUrl(url: string): string {
    const match = url?.match(/^https?:\/\/[^\/]+/);
    return match ? match[0] : '';
  }

  private getRootUrlWithoutProtocolAndWww(url: string): string {
    const rootUrl = this.getRootUrl(url);
    const rootUrlWithoutProtocolAndWww = rootUrl
      ?.replace(/^https?:\/\//, '')
      ?.replace(/^www\./, '');
    return rootUrlWithoutProtocolAndWww;
  }

  private getDomainUrl(url: string): string {
    const match = url?.match(/^https?:\/\/([^\/]+)/);
    if (!match) return '';
    const hostname = match[1]; // e.g., 'api.sub.example.com'
    const parts = hostname.split('.');
    if (parts.length < 2) return hostname;
    // Handle domains like co.uk, com.au by preserving the last 2 or 3 parts
    const tld = parts.slice(-2).join('.');
    const tldExceptions = ['co.uk', 'com.au', 'org.uk', 'co.in', 'gov.uk'];
    if (tldExceptions.includes(tld) && parts.length >= 3) {
      return parts.slice(-3).join('.'); // e.g., 'example.co.uk'
    }
    return parts.slice(-2).join('.'); // e.g., 'example.com'
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
      urlEn: input?.url?.en,
      urlFr: input?.url?.fr,
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
      urlEn,
      urlFr,
      path,
      nameEn,
      nameFr,
      providerEn,
      providerFr,
      descriptionEn,
      descriptionFr,
    } = data;
    const queries = [
      // All query combinations
      `site:${this.getDomainUrl(urlEn)} ${nameEn}`,
      `site:${this.getDomainUrl(urlEn)} ${nameFr}`,
      `site:${this.getDomainUrl(urlEn)} ${providerEn}`,
      `site:${this.getDomainUrl(urlEn)} ${providerFr}`,
      `site:${this.getDomainUrl(urlEn)} ${descriptionEn}`,
      `site:${this.getDomainUrl(urlEn)} ${descriptionFr}`,
      `site:${this.getDomainUrl(urlEn)} ${path}`,

      `site:${this.getDomainUrl(urlFr)} ${nameEn}`,
      `site:${this.getDomainUrl(urlFr)} ${nameFr}`,
      `site:${this.getDomainUrl(urlFr)} ${providerEn}`,
      `site:${this.getDomainUrl(urlFr)} ${providerFr}`,
      `site:${this.getDomainUrl(urlFr)} ${descriptionEn}`,
      `site:${this.getDomainUrl(urlFr)} ${descriptionFr}`,
      `site:${this.getDomainUrl(urlFr)} ${path}`,

      // All groups
      // `site:${this.getRootUrl(url)} ${nameEn}`,
      // `site:${this.getRootUrl(url)} ${nameFr}`,
      // `site:${this.getRootUrl(url)} ${providerEn}`,
      // `site:${this.getRootUrl(url)} ${providerFr}`,

      // `site:${this.getRootUrl(url)} ${descriptionEn}`,
      // `site:${this.getRootUrl(url)} ${descriptionFr}`,
      // `site:${this.getRootUrl(url)} ${path}`,

      // `site:${this.getDomainUrl(url)} ${nameEn}`,
      // `site:${this.getDomainUrl(url)} ${nameFr}`,
      // `site:${this.getDomainUrl(url)} ${providerEn}`,
      // `site:${this.getDomainUrl(url)} ${providerFr}`,

      // `site:${this.getDomainUrl(url)} ${descriptionEn}`,
      // `site:${this.getDomainUrl(url)} ${descriptionFr}`,
      // `site:${this.getDomainUrl(url)} ${path}`,

      // `site:${url} ${nameEn} ${providerEn} ${descriptionEn}`,
      // `site:${url} ${nameEn} ${descriptionEn}`,
      // `site:${url} ${nameEn} ${providerEn}`,
      // `site:${url} ${nameFr} ${providerFr} ${descriptionFr}`,
      // `site:${url} ${nameFr} ${descriptionFr}`,
      // `site:${url} ${nameFr} ${providerFr}`,

      // `${nameEn} ${providerEn} ${descriptionEn}`,
      // `${nameEn} ${descriptionEn}`,
      // `${nameEn} ${providerEn}`,
      // `${nameFr} ${providerFr} ${descriptionFr}`,
      // `${nameFr} ${descriptionFr}`,
      // `${nameFr} ${providerFr}`,

      // Original
      // `site:${url} ${nameEn}`,
      // `site:${url} ${nameFr}`,
      // `site:${url} ${providerEn}`,
      // `site:${url} ${providerFr}`,
      // `site:${url} ${descriptionEn}`,
      // `site:${url} ${descriptionFr}`,
      // `site:${url} ${path}`,

      // `${nameEn}`,
      // `${nameFr}`,
      // `${providerEn}`,
      // `${providerFr}`,
      // `${descriptionEn}`,
      // `${descriptionFr}`,

      // `${nameEn} ${descriptionEn}`,
      // `${nameEn} ${providerEn}`,
      // `${nameFr} ${descriptionFr}`,
      // `${nameFr} ${providerFr}`
    ];
    console.log('queries', queries);
    return removeDuplicates(queries);
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
    return items.slice(0, 3).map((item) => item.link) as string[];
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
