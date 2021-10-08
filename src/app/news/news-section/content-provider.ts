import { Observable } from "rxjs/Observable";
import { ContentItem } from "./content-item";
import { SocialType } from "./social-type";

export interface RenderResponse {
  boxes: any[];
  slides: any[];
}

export interface ContentProvider {

  languages: string[];
  countries: string[];
  sports: string[];
  page: number;
  pageSize: number;
  tags: string[];
  query: string;
  readonly socialType: SocialType;

  updateParameters(languages: string[], countries: string[], pageSize: number, tags: string[], query: string, sports: string[]);
  prefetchAll(): Promise<any>;
  prefetchLanguages(): Promise<any>;
  getContent(): Promise<any>;
  render(): void;
  reset(resetData: boolean): void;
  openItem(item: ContentItem);
  onItemError(item: ContentItem);
  hasBoxes(): boolean;
  hasSlides(): boolean;
  getSlides(): Observable<ContentItem[]>;
}
