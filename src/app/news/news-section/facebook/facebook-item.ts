import { ContentItem } from "../content-item";

export interface FacebookItem extends ContentItem {
  postId?: string;
  postUrl?: string;
  description?: string;
  mediaType?: string;
  urlToMedia: string;
  thumbnail?: string;

  provider?: string;
  type?: string;
  price?: string;
  sport?: string;
  status?: string;
  title?: string;
  url?: string;
}
