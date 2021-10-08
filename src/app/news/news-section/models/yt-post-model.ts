import { SocialType } from "../social-type";
import { SocialPage } from "./fb-post-model";

export class SingleYtBoxes {
  constructor(hidden: boolean) {
    this.hidden = hidden;
    this.items = [];
  }
  hidden: boolean;
  items: SingleYt[];
}

export class SingleYt {
  constructor(element: any) {
    this.id = element.id;

    if (element.hasOwnProperty('type') && (element.type === 'AFFILIATE' || element.type === 'ADS')) {
      this.provider = element.provider;
      this.type = element.type;
      this.price = element.price;
      this.status = element.status;
      this.title = element.title;
      this.url = element.url;
      this.urlToMedia = element.urlToMedia;
    } else {
      this.postId = element.postId;
      this.mediaType = element.mediaType;
      this.description = element.description;
      this.subDescription = element.subDescription;
      this.publishedAt = element.publishedAt;
      this.thumbnail = this.isPostHasThumbnail(element);
      this.socialPage = new SocialPage(element.socialPage.socialPageUsername, element.socialPage.idRef, element.socialPage.pageType, element.socialPage.sport);
    }

  }
  id: string;

  postId?: string;
  description?: string;
  subDescription?: string;
  mediaType?: string;
  thumbnail?: string;
  socialPage?: SocialPage;
  withOutThumbnail?: boolean;
  publishedAt?: number;

  title?: string;
  url?: string;
  provider?: string;
  type?: string;
  price?: string;
  status?: string;
  urlToMedia?: string;

  isPostHasThumbnail(element: any) {
    if (this.mediaType === 'VIDEO' && element.thumbnail) {
      return element.thumbnail;
    } else {
      this.withOutThumbnail = true;
      return null;
    }
  }
}

export class YouTubeContent {
  constructor(
    content: SingleYt[],
    socialType: SocialType, recurring: boolean, previousBoxes?: SingleYtBoxes[]
  ) {
    this.slides = [];
    this.ytBoxes = [];
    recurring ?
      this.updateNewsBoxes(content, socialType, previousBoxes) : this.getSlidesBoxes(content);
  }
  slides: SingleYt[];
  ytBoxes: SingleYtBoxes[];
  getSlidesBoxes(elements: SingleYt[]) {
    let box = new SingleYtBoxes(false);
    elements.forEach((singleNew: SingleYt, index: number) => {
      const publishedAt = new Date();

      const updatedSinglePost = new SingleYt(singleNew);
      if (this.slides.length < 3) {
        this.slides.push(updatedSinglePost);
      }

      if (!this.slides.includes(updatedSinglePost)) {
        box.items.push(updatedSinglePost);
        if (box.items.length >= 2 || elements.length === index + 1) {
          this.ytBoxes.push(box);
          box = new SingleYtBoxes(false);
        }
      }
    });

  }

  updateNewsBoxes(elements: SingleYt[], socialType: SocialType, previousBoxes: SingleYtBoxes[]) {
    let box = new SingleYtBoxes(false);
    const ytBoxes: SingleYtBoxes[] = [];
    const existedBoxes: SingleYtBoxes[] = previousBoxes;
    if (previousBoxes[previousBoxes.length - 1].items.length === 1) {
      box.items.push(previousBoxes[previousBoxes.length - 1].items[0]);
      existedBoxes.splice(previousBoxes.length - 1, 1);
    }
    elements.forEach((singleNew: SingleYt, index: number) => {
      const publishedAt = new Date();
      const updatedSinglePost = new SingleYt(singleNew);
      console.log(updatedSinglePost);
      box.items.push(updatedSinglePost);
      if (box.items.length >= 2 || elements.length === index + 1) {
        ytBoxes.push(box);
        box = new SingleYtBoxes(false);
      }
    });
    this.ytBoxes = [...existedBoxes, ...ytBoxes];
  }

  getLastId() {
    if (this.ytBoxes.length > 0) {
      const lastBox = this.ytBoxes[this.ytBoxes.length - 1];
      return lastBox.items[lastBox.items.length - 1].id;
    }
  }
}
