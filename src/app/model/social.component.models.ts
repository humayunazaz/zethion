import { ResultsBase } from "./results.model";

export enum SocialPageType {
  PEOPLE = "PEOPLE",
  ATHLETE = "ATHLETE",
  TEAM = "TEAM",
  LEAGUE = "LEAGUE",
  MEDIA = "MEDIA"
}

export var SocialPageTypeSelection = [
  SocialPageType.ATHLETE,
  SocialPageType.TEAM,
  SocialPageType.LEAGUE,
  SocialPageType.PEOPLE,
  SocialPageType.MEDIA
]

export enum Social {
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  TWITTER = "TWITTER",
  OFFICIAL = "OFFICIAL",
  YOUTUBE = "YOUTUBE"
}

export var SocialSelection = [
  Social.FACEBOOK,
  Social.INSTAGRAM,
  Social.TWITTER,
  Social.OFFICIAL,
  Social.YOUTUBE
]

export interface SocialPage {
  social: Social;
  pageType: SocialPageType;
  socialPageId: string;
  socialPageUsername: string;
  socialPageName: string;
  pageUrl: string;
}

export interface SocialPagePerspective {
  id: number;
  name: string;
  type: SocialPageType;
  sport: string;
  pages: {
    FACEBOOK: SocialPage,
    INSTAGRAM: SocialPage,
    TWITTER: SocialPage,
    OFFICIAL: SocialPage,
    YOUTUBE: SocialPage
  };
}

export interface SocialPagePerspectives extends ResultsBase {
  content: SocialPagePerspective[];
}
