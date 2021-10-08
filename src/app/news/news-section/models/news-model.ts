import { SocialType } from "../social-type";

export class SingleBoxes {
  constructor(hidden: boolean) {
    this.hidden = hidden;
    this.items = [];
  }
  hidden: boolean;
  items: SingleNews[];
}

export class SingleNews {
  constructor(element: any, social: SocialType, publishedAt: Date) {
    this.id = element.id;
    this.title = element.title;
    this.url = element.url;
    this.urlToMedia = element.urlToMedia;

    if (element.hasOwnProperty('type') && (element.type === 'AFFILIATE' || element.type === 'ADS')) {
      this.provider = element.provider;
      this.type = element.type;
      this.price = element.price;
      this.sport = element.sport;
      this.status = element.status;
    } else {
      this.author = element.author;
      this.content = element.content;
      this.countryCode = element.countryCode;
      this.description = element.description;
      this.language = element.language;
      this.mediaType = element.mediaType;
      this.hidden = false;
      this.socialType = social;
      this.publishedAt = new Date(publishedAt);
      this.sourceName = element.sourceName;
      this.sourceId = element.sourceId;
      this.sourceSport = element.sourceSport;
    }
  }
  id: number;
  url: string;
  urlToMedia: string;
  title: string;

  author?: string;
  content?: string;
  countryCode?: string;
  description?: string;
  language?: string;
  mediaType?: string;
  hidden?: boolean;
  socialType?: SocialType;
  publishedAt?: Date;
  sourceName?: string;
  sourceId?: number;
  sourceSport?: string;

  provider?: string;
  type?: string;
  price?: string;
  sport?: string;
  status?: string;
}
export class NewsContent {
  constructor(content: SingleNews[], socialType: SocialType, recurring: boolean, previousBoxes?: SingleBoxes[]) {
    this.slides = [];
    this.newsBoxes = [];
    recurring ? this.updateNewsBoxes(content, socialType, previousBoxes) : this.getSlidesBoxes(content, socialType);
  }
  slides: SingleNews[];
  newsBoxes: SingleBoxes[];

  getSlidesBoxes(elements: SingleNews[], socialType: SocialType) {
    let box = new SingleBoxes(false);
    elements.forEach((singleNew: SingleNews, index: number) => {
      const publishedAt = new Date(singleNew.publishedAt);
      const updatedSingleNews = new SingleNews(singleNew, socialType, publishedAt);
      if (this.isNewsItemValid(updatedSingleNews) || this.isAffliatesItemValid(updatedSingleNews)) {
        if (updatedSingleNews.mediaType === 'VIDEO') {
          console.log(updatedSingleNews);
        }
        if (this.slides.length < 3 && updatedSingleNews.mediaType !== 'VIDEO') {
          this.slides.push(updatedSingleNews);
        }

        if (!this.slides.includes(updatedSingleNews)) {
          box.items.push(updatedSingleNews);
          if (box.items.length >= 2 || elements.length === index + 1) {
            this.newsBoxes.push(box);
            box = new SingleBoxes(false);
          }
        }
      }
    });
  }

  updateNewsBoxes(elements: SingleNews[], socialType: SocialType, previousBoxes: SingleBoxes[]) {
    let box = new SingleBoxes(false);
    const newBoxes: SingleBoxes[] = [];
    const existedBoxes: SingleBoxes[] = previousBoxes;
    if (previousBoxes[previousBoxes.length - 1].items.length === 1) {
      box.items.push(previousBoxes[previousBoxes.length - 1].items[0]);
      existedBoxes.splice(previousBoxes.length - 1, 1);
    }
    elements.forEach((singleNew: SingleNews, index: number) => {
      const publishedAt = new Date(singleNew.publishedAt);
      const updatedSingleNews = new SingleNews(singleNew, socialType, publishedAt);
      if (this.isNewsItemValid(updatedSingleNews) || this.isAffliatesItemValid(updatedSingleNews)) {
        if (updatedSingleNews.mediaType === 'VIDEO') {
          console.log(updatedSingleNews);
        }
        box.items.push(updatedSingleNews);
        if (box.items.length >= 2 || elements.length === index + 1) {
          newBoxes.push(box);
          box = new SingleBoxes(false);
        }
      }
    });
    this.newsBoxes = [...existedBoxes, ...newBoxes];
  }

  isNewsItemValid(element: SingleNews) {
    return element.title && element.description && element.urlToMedia;
  }

  isAffliatesItemValid(element: SingleNews) {
    return element.title && element.type && element.urlToMedia;
  }

  getLastNewId() {
    if (this.newsBoxes.length > 0) {
      const lastBox = this.newsBoxes[this.newsBoxes.length - 1];
      return lastBox.items[lastBox.items.length - 1].id;
    }
  }
}
