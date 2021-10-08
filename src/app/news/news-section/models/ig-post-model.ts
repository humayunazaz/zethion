import { SocialType } from "../social-type";
import { SocialPage } from "./fb-post-model";

export class SingleIgBoxes {
    constructor(hidden: boolean) {
        this.hidden = hidden;
        this.items = [];
    }
    hidden: boolean;
    items: SingleIg[];
}

export class SingleIg {
    constructor(element: any) {
        this.id = element.id;
        this.urlToMedia = element.urlToMedia;

        if (element.hasOwnProperty('type') && (element.type === 'AFFILIATE' || element.type === 'ADS')) {
            this.provider = element.provider;
            this.type = element.type;
            this.price = element.price;
            this.status = element.status;
            this.title = element.title;
            this.url = element.url;
        } else {
            this.postId = element.postId;
            this.postUrl = element.postUrl;
            this.mediaType = element.mediaType;
            this.description = element.description;
            this.thumbnail = this.isPostHasThumbnail(element);
            this.publishedAt = element.publishedAt;
            this.socialPage = new SocialPage(element.socialPage.socialPageUsername, element.socialPage.idRef, element.socialPage.pageType, element.socialPage.sport);
        }
    }
    id: string;
    urlToMedia: string;

    postId?: string;
    postUrl?: string;
    description?: string;
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

    isPostHasThumbnail(element: any) {
        if (this.mediaType === 'VIDEO' && element.thumbnail) {
            return element.thumbnail;
        } else if (this.mediaType === 'IMAGE' && this.urlToMedia) {
            return this.urlToMedia;
        } else {
            this.withOutThumbnail = true;
            return null;
        }
    }
}

export class InstagramContent {
    constructor(
        content: SingleIg[],
        socialType: SocialType, recurring: boolean, previousBoxes?: SingleIgBoxes[]
    ) {
        this.slides = [];
        this.igBoxes = [];
        recurring ?
            this.updateNewsBoxes(content, socialType, previousBoxes) : this.getSlidesBoxes(content);
    }
    slides: SingleIg[];
    igBoxes: SingleIgBoxes[];
    getSlidesBoxes(elements: SingleIg[]) {
        let box = new SingleIgBoxes(false);
        elements.forEach((singleNew: SingleIg, index: number) => {
            const publishedAt = new Date();

            const updatedSinglePost = new SingleIg(singleNew);
            if (this.isInstagramItemValid(updatedSinglePost) || this.isAffliatesItemValid(updatedSinglePost)) {
                if (this.slides.length < 3) {
                    this.slides.push(updatedSinglePost);
                }

                if (!this.slides.includes(updatedSinglePost)) {
                    box.items.push(updatedSinglePost);
                    if (box.items.length >= 2 || elements.length === index + 1) {
                        this.igBoxes.push(box);
                        box = new SingleIgBoxes(false);
                    }
                }
            }
        });

    }

    updateNewsBoxes(elements: SingleIg[], socialType: SocialType, previousBoxes: SingleIgBoxes[]) {
        let box = new SingleIgBoxes(false);
        const igBoxes: SingleIgBoxes[] = [];
        const existedBoxes: SingleIgBoxes[] = previousBoxes;
        if (previousBoxes[previousBoxes.length - 1].items.length === 1) {
            box.items.push(previousBoxes[previousBoxes.length - 1].items[0]);
            existedBoxes.splice(previousBoxes.length - 1, 1);
        }
        elements.forEach((singleNew: SingleIg, index: number) => {
            const publishedAt = new Date();
            const updatedSinglePost = new SingleIg(singleNew);
            if (this.isInstagramItemValid(updatedSinglePost) || this.isAffliatesItemValid(updatedSinglePost)) {
                console.log(updatedSinglePost);
                box.items.push(updatedSinglePost);
                if (box.items.length >= 2 || elements.length === index + 1) {
                    igBoxes.push(box);
                    box = new SingleIgBoxes(false);
                }
            }
        });
        this.igBoxes = [...existedBoxes, ...igBoxes];
    }

    isInstagramItemValid(igItem: SingleIg) {
        return igItem.postUrl && igItem.postUrl !== 'None';
    }

    isAffliatesItemValid(element: SingleIg) {
        return element.title && element.type && element.urlToMedia;
    }

    getLastId() {
        if (this.igBoxes.length > 0) {
            const lastBox = this.igBoxes[this.igBoxes.length - 1];
            return lastBox.items[lastBox.items.length - 1].id;
        }
    }
}
