export class SingleCuriosityBoxes {
  constructor(hidden: boolean) {
    this.hidden = hidden;
    this.items = [];
  }
  hidden: boolean;
  items: SingleCuriosity[];
}

export class SingleCuriosity {
  constructor(element: any, publishedAt: Date) {
    this.id = element.id;
    this.title = element.title;
    this.url = element.url;
    this.urlToMedia = element.urlToMedia;
    
    if (element.hasOwnProperty('type') && (element.type === 'AFFILIATE' || element.type === 'ADS')) {
      this.provider = element.provider;
      this.type = element.type;
      this.price = element.price;
      this.status = element.status;
      this.sport = element.sport;
    } else {
      this.author = element.author;
      this.content = element.content;
      this.countryCode = element.countryCode;
      this.description = element.description;
      this.language = element.language;
      this.mediaType = element.mediaType;
      this.publishedAt = new Date(publishedAt);
      this.sourceName = element.sourceName;
      this.sourceSport = element.sourceSport;
    }
  }
  id?: number;
  title: string;
  url: string;
  urlToMedia: string;
  
  newsType?: string;
  sourceName?: string;
  language?: string;
  countryCode?: string;
  author?: string;
  description?: string;
  content?: string;
  mediaType?: string;
  publishedAt?: Date;
  sourceSport?: string;
  
  provider?: string;
  sport?: string;
  type?: string;
  price?: string;
  status?: string;
}

export class CuriositiesContent {
  constructor(content: SingleCuriosity[], recurring: boolean, previousBoxes?: SingleCuriosityBoxes[]) {
    this.slides = [];
    this.curiositiesBoxes = [];
    recurring ? this.updateCuriositiesBoxes(content, previousBoxes) : this.getSlidesBoxes(content);
  }
  slides: SingleCuriosity[];
  curiositiesBoxes: SingleCuriosityBoxes[];

  getSlidesBoxes(elements: SingleCuriosity[]) {
    let box = new SingleCuriosityBoxes(false);
    elements.forEach((singleCuriosity: SingleCuriosity, index: number) => {
      const publishedAt = new Date(singleCuriosity.publishedAt);
      const updatedSingleCuriosity = new SingleCuriosity(singleCuriosity, publishedAt);
      if (this.isCuriositiesItemValid(updatedSingleCuriosity) || this.isAffliatesItemValid(updatedSingleCuriosity)) {

        if (this.slides.length < 3) {
          this.slides.push(updatedSingleCuriosity);
        }

        if (!this.slides.includes(updatedSingleCuriosity)) {
          box.items.push(updatedSingleCuriosity);
          if (box.items.length >= 2 || elements.length === index + 1) {
            this.curiositiesBoxes.push(box);
            box = new SingleCuriosityBoxes(false);
          }
        }
      }
    });
  }

  updateCuriositiesBoxes(elements: SingleCuriosity[], previousBoxes: SingleCuriosityBoxes[]) {
    let box = new SingleCuriosityBoxes(false);
    const curiosityBoxes: SingleCuriosityBoxes[] = [];
    const existedBoxes: SingleCuriosityBoxes[] = previousBoxes;
    if (previousBoxes[previousBoxes.length - 1].items.length === 1) {
      box.items.push(previousBoxes[previousBoxes.length - 1].items[0]);
      existedBoxes.splice(previousBoxes.length - 1, 1);
    }
    elements.forEach((singleCuriosity: SingleCuriosity, index: number) => {
      const publishedAt = new Date(singleCuriosity.publishedAt);
      const updatedSingleCuriosity = new SingleCuriosity(singleCuriosity, publishedAt);
      if (this.isCuriositiesItemValid(updatedSingleCuriosity) || this.isAffliatesItemValid(updatedSingleCuriosity)) {
        box.items.push(updatedSingleCuriosity);
        if (box.items.length >= 2 || elements.length === index + 1) {
          curiosityBoxes.push(box);
          box = new SingleCuriosityBoxes(false);
        }
      }
    });
    this.curiositiesBoxes = [...existedBoxes, ...curiosityBoxes];
  }

  isCuriositiesItemValid(element: SingleCuriosity) {
    return element.title && element.description && element.urlToMedia;
  }

  isAffliatesItemValid(element: SingleCuriosity) {
    return element.title && element.type && element.urlToMedia;
  }

  getLastCuriositiesId() {
    if (this.curiositiesBoxes.length > 0) {
      const lastBox = this.curiositiesBoxes[this.curiositiesBoxes.length - 1];
      return lastBox.items[lastBox.items.length - 1].id;
    }
  }
}