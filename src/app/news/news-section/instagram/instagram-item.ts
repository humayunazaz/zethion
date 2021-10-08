import { ContentItem } from "../content-item";

export interface InstagramItem extends ContentItem {
  postId: string;
  postUrl: string;
  description: string;
  mediaType: string;
  urlToMedia: string;
  thumbnail?: string;
}
