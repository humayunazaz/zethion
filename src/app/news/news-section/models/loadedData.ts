import { SingleNews, SingleBoxes } from "./news-model";

export class SingleSocialData {
    constructor (slides: SingleNews[], boxes: SingleBoxes[], page: number, countries: string[]) {
        this.contentSlides = slides;
        this.contentBoxes = boxes;
        this.page = page;
        this.countries = countries;
    }
    contentSlides: SingleNews[];
    contentBoxes: SingleBoxes[];
    page: number;
    countries: string[];
}

export class SingleSocialTypeData {
    constructor (content: SingleSocialData, socialType: string) {
        switch(socialType) {
            case 'zt':
                this.zt = content;
                break;
            case 'fb':
                this.fb = content;
        }

    }
    zt: SingleSocialData;
    fb: SingleSocialData;
}

export class SingleLanguageData {
    constructor (lang: string, content: SingleSocialTypeData) {
        this.langId = lang;
        this.content = content;
    }
    langId: string;
    content: SingleSocialTypeData;
}

export class PreviouslyLoadedContent {
    constructor (slides: any[], boxes: SingleBoxes[], language: string, socialType: string, page: number, countries: string[]) {
        this.content = [];
        const SingleSocial = new SingleSocialData(slides, boxes, page, countries);
        const SingleSocialType = new SingleSocialTypeData(SingleSocial, socialType);
        const SingleLangData = new SingleLanguageData(language, SingleSocialType);
        this.content.push(SingleLangData);
    }
    content: SingleLanguageData[];

    updateContent(langId: string, slides: any[], boxes: any[], socialType: string, page: number, countries: string[]) {
        let founded = false;
        this.content.forEach(singleLanguageData => {
            if (singleLanguageData.langId === langId) {
                if (singleLanguageData.content[socialType]) {
                    singleLanguageData.content[socialType].contentSlides = slides;
                    singleLanguageData.content[socialType].contentBoxes = boxes;
                    singleLanguageData.content[socialType].page = page;
                    singleLanguageData.content[socialType].countries = countries;
                    founded = true;
                } else {
                    const SingleSocial = new SingleSocialData(slides, boxes, page, countries);
                    singleLanguageData.content[socialType] = SingleSocial;
                    founded = true;
                    // console.log(this.content);
                }
            }
        });
        if (!founded) {
            const SingleSocial = new SingleSocialData(slides, boxes, page, countries);
            const SingleSocialType = new SingleSocialTypeData(SingleSocial, socialType);
            const SingleLangData = new SingleLanguageData(langId, SingleSocialType);
            this.content.push(SingleLangData);
        }
    }

    foundExistedContent(langId: string, socialType: string, countries: string[], page?: number) {
        let founded = null;
        this.content.forEach(SingleLangData => {
            if (SingleLangData.langId === langId && SingleLangData.content[socialType]) {
                console.log(SingleLangData.content[socialType]);
                if (
                    SingleLangData.content[socialType].contentBoxes.length > 0 &&
                    this.compareCountries(SingleLangData.content[socialType].countries, countries)
                ) {
                    founded = SingleLangData.content[socialType];
                } else if (!this.compareCountries(SingleLangData.content[socialType].countries, countries)) {
                    this.removePreviousCountryBasedData(langId, socialType);
                }
            }
        });
        return founded;
    }

    removePreviousCountryBasedData(langId: string, socialType: string) {
        this.content.forEach(SingleLangData => {
            if (SingleLangData.langId === langId && SingleLangData.content[socialType]) {
                SingleLangData.content[socialType].contentBoxes = [];
                SingleLangData.content[socialType].contentSlides = [];
                SingleLangData.content[socialType].page = [];
            }
        });
    }

    compareCountries(savedCountries: string[], incomingCountries: string[]) {
        let matched = false;
        const incomingCountriesSorted = incomingCountries.slice().sort();
        if (savedCountries.length === incomingCountries.length) {
            if (savedCountries.slice().sort().every((value: any, index:any) => {
                return value === incomingCountriesSorted[index];
            })) {
                matched = true;
            }
        }
        return matched;
    }
}
