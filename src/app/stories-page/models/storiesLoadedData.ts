import { SingleStory, SingleStoryBoxes } from "./stories-model";

export class SingleStoryData {
  constructor(slides: SingleStory[], boxes: SingleStoryBoxes[], page: number, countries: string[]) {
    this.contentSlides = slides;
    this.contentBoxes = boxes;
    this.page = page;
    this.countries = countries;
  }
  contentSlides: SingleStory[];
  contentBoxes: SingleStoryBoxes[];
  page: number;
  countries: string[];
}

export class SingleLanguageData {
  constructor(lang: string, content: SingleStoryData) {
    this.langId = lang;
    this.content = content;
  }
  langId: string;
  content: SingleStoryData;
}

export class PreviouslyLoadedStoryContent {
  constructor(slides: any[], boxes: SingleStoryBoxes[], language: string, page: number, countries: string[]) {
    this.content = [];
    const SingleSocial = new SingleStoryData(slides, boxes, page, countries);
    const SingleLangData = new SingleLanguageData(language, SingleSocial);
    this.content.push(SingleLangData);
  }
  content: SingleLanguageData[];

  updateContent(langId: string, slides: any[], boxes: any[], page: number, countries: string[]) {
    let founded = false;
    this.content.forEach(singleLanguageData => {
      if (singleLanguageData.langId === langId) {
        if (singleLanguageData.content) {
          singleLanguageData.content.contentSlides = slides;
          singleLanguageData.content.contentBoxes = boxes;
          singleLanguageData.content.page = page;
          singleLanguageData.content.countries = countries;
          founded = true;
        } else {
          const SingleSocial = new SingleStoryData(slides, boxes, page, countries);
          singleLanguageData.content = SingleSocial;
          founded = true;
          // console.log(this.content);
        }
      }
    });
    if (!founded) {
      const SingleSocial = new SingleStoryData(slides, boxes, page, countries);
      const SingleLangData = new SingleLanguageData(langId, SingleSocial);
      this.content.push(SingleLangData);
    }
    // console.log('🚀 ~ file: loadedData.ts ~ line 81 ~ PreviouslyLoadedStoryContent ~ updateContent ~ this.content', this.content);
  }

  foundExistedContent(langId: string, countries: string[], page?: number) {
    let founded = null;
    this.content.forEach(SingleLangData => {
      if (SingleLangData.langId === langId && SingleLangData.content) {
        console.log(SingleLangData.content);
        if (
          SingleLangData.content.contentBoxes.length > 0 &&
          this.compareCountries(SingleLangData.content.countries, countries)
        ) {
          founded = SingleLangData.content;
        } else if (!this.compareCountries(SingleLangData.content.countries, countries)) {
          this.removePreviousCountryBasedData(langId);
        }
      }
    });
    return founded;
  }

  removePreviousCountryBasedData(langId: string) {
    this.content.forEach(SingleLangData => {
      if (SingleLangData.langId === langId && SingleLangData.content) {
        SingleLangData.content.contentBoxes = [];
        SingleLangData.content.contentSlides = [];
        SingleLangData.content.page = 0;
      }
    });
  }

  compareCountries(savedCountries: string[], incomingCountries: string[]) {
    let matched = false;
    const incomingCountriesSorted = incomingCountries.slice().sort();
    if (savedCountries.length === incomingCountries.length) {
      if (savedCountries.slice().sort().every((value: any, index: any) => {
        return value === incomingCountriesSorted[index];
      })) {
        matched = true;
      }
    }
    return matched;
  }
}
