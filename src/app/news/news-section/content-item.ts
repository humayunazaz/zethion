import { SocialType } from "./social-type";

export interface ContentItem {
  hidden?: boolean;
  socialType?: SocialType;
  language?: string;
  countryCode?: string;
  publishedAt?: Date;
}
