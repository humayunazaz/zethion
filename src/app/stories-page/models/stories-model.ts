import { Media, Paragraph } from "./stories-item";

export class SingleStoryBoxes {
  constructor(hidden: boolean) {
    this.hidden = hidden;
    this.items = [];
  }
  hidden: boolean;
  items: SingleStory[];
}

export class SingleStory {
  constructor(element: any, publishedAt: Date) {
    this.id = element.id;
    this.sport = element.sport;

    if (element.hasOwnProperty('type') && (element.type === 'AFFILIATE' || element.type === 'ADS')) {
      this.provider = element.provider;
      this.type = element.type;
      this.price = element.price;
      this.status = element.status;
      this.title = element.title;
      this.url = element.url;
      this.urlToMedia = element.urlToMedia;
    } else {
      this.author = element.author;
      this.code = element.code;
      this.rateAverage = element.rateAverage;
      this.clientRate = element.clientRate;
      this.paragraphs = element.paragraphs;
      this.medias = element.medias;
      this.hidden = false;
      this.publishedAt = new Date(publishedAt);
    }
  }
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

  title?: string;
  url?: string;
  urlToMedia?: string;
  provider?: string;
  type?: string;
  price?: string;
  status?: string;
}

export class StoriesContent {
  constructor(content: SingleStory[], recurring: boolean, previousBoxes?: SingleStoryBoxes[]) {
    console.log('🚀 ~ file: stories-model.ts ~ line 59 ~ StoriesContent ~ constructor ~ content', content);
    this.slides = [];
    this.storiesBoxes = [];
    recurring ? this.updateStoriesBoxes(content, previousBoxes) : this.getSlidesBoxes(content);
  }
  slides: SingleStory[];
  storiesBoxes: SingleStoryBoxes[];

  getSlidesBoxes(elements: SingleStory[]) {
    let box = new SingleStoryBoxes(false);
    elements.forEach((singleStory: SingleStory, index: number) => {
      const publishedAt = new Date(singleStory.publishedAt);
      const updatedSingleStory = new SingleStory(singleStory, publishedAt);
      if (this.isStoriesItemValid(updatedSingleStory) || this.isAffliatesItemValid(updatedSingleStory)) {

        if (this.slides.length < 3) {
          this.slides.push(updatedSingleStory);
        }

        if (!this.slides.includes(updatedSingleStory)) {
          box.items.push(updatedSingleStory);
          if (box.items.length >= 2 || elements.length === index + 1) {
            this.storiesBoxes.push(box);
            box = new SingleStoryBoxes(false);
          }
        }
      }
    });
  }

  updateStoriesBoxes(elements: SingleStory[], previousBoxes: SingleStoryBoxes[]) {
    let box = new SingleStoryBoxes(false);
    const storyBoxes: SingleStoryBoxes[] = [];
    const existedBoxes: SingleStoryBoxes[] = previousBoxes;
    if (previousBoxes[previousBoxes.length - 1].items.length === 1) {
      box.items.push(previousBoxes[previousBoxes.length - 1].items[0]);
      existedBoxes.splice(previousBoxes.length - 1, 1);
    }
    console.log('🚀 ~ file: stories-model.ts ~ line 97 ~ StoriesContent ~ elements.forEach ~ elements', existedBoxes, storyBoxes);
    elements.forEach((singleStory: SingleStory, index: number) => {
      const publishedAt = new Date(singleStory.publishedAt);
      const updatedSingleStory = new SingleStory(singleStory, publishedAt);
      if (this.isStoriesItemValid(updatedSingleStory) || this.isAffliatesItemValid(updatedSingleStory)) {
        box.items.push(updatedSingleStory);
        if (box.items.length >= 2 || elements.length === index + 1) {
          storyBoxes.push(box);
          box = new SingleStoryBoxes(false);
        }
      }
    });
    this.storiesBoxes = [...existedBoxes, ...storyBoxes];
  }

  isStoriesItemValid(element: SingleStory) {
    return element.code && !!element.paragraphs.length && !!element.medias.length;
  }

  isAffliatesItemValid(element: SingleStory) {
    return element.title && element.type && element.urlToMedia;
  }

  getLastStoriesId() {
    if (this.storiesBoxes.length > 0) {
      const lastBox = this.storiesBoxes[this.storiesBoxes.length - 1];
      return lastBox.items[lastBox.items.length - 1].id;
    }
  }
}