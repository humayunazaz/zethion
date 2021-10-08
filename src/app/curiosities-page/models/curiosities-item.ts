import { SafeHtml } from "@angular/platform-browser";

export interface CuriositiesItem {
  id: number;
  newsType: string;
  sourceName: string;
  language: string;
  countryCode: string;
  author: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToMedia: string;
  mediaType: string;
  publishedAt?: Date;
  sourceSport: string;
}
