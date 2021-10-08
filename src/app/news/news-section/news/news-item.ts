import { Observable } from 'rxjs/Observable';
import { ContentItem } from '../content-item';

export interface NewsItem extends ContentItem {
  id: number;
  title: string;
  urlToMedia: string;
  url: string;
  source?: string;
  mediaType?: string;
  sourceName?: string;
  sourceId?: number;
  sourceSport?: string;

  provider?: string;
  type?: string;
  price?: string;
  sport?: string;
  status?: string;
}
