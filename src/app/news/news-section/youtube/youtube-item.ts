import { ContentItem } from "../content-item";

export interface YoutubeItem extends ContentItem {
  postId: string;
  description: string;
  mediaType: string;
  thumbnail?: string;
}
