import { ContentItem } from "./content-item";

export class ContentBox {
  constructor(language: string, hidden = false) {
    this.language = language;
    this.hidden = hidden;
  }
  items: ContentItem[] = [];
  hidden?: boolean;
  language?: string;
}
