export interface StoriesItem {
  id: number;
  sport: string;

  author?: string;
  code?: string;
  rateAverage?: number | string;
  clientRate?: number;
  paragraphs?: Paragraph[];
  medias?: Media[];
  hidden?: boolean;
  publishedAt?: Date;

  provider?: string;
  type?: string;
  price?: string;
  status?: string;
  title?: string;
  url?: string;
  urlToMedia?: string;
}

export interface Media {
  urlToMedia: string;
  mediaType: string;
}

export interface Paragraph {
  code: string;
}
