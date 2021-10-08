import { SocialType } from "../social-type";
import { SocialPage } from "./fb-post-model";

export class SingleTwBoxes {
    constructor(hidden: boolean) {
        this.hidden = hidden;
        this.items = [];
    }
    hidden: boolean;
    items: SingleTw[];
}

export class SingleTw {
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
            this.publishedAt = element.publishedAt;
            this.thumbnail = this.isPostHasThumbnail(element);
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

export class TwitterContent {
    constructor(
        content: SingleTw[],
        socialType: SocialType, recurring: boolean, previousBoxes?: SingleTwBoxes[]
    ) {
        this.slides = [];
        this.twBoxes = [];
        recurring ?
            this.updateNewsBoxes(content, socialType, previousBoxes) : this.getSlidesBoxes(content);
    }
    slides: SingleTw[];
    twBoxes: SingleTwBoxes[];
    getSlidesBoxes(elements: SingleTw[]) {
        let box = new SingleTwBoxes(false);
        elements.forEach((singleNew: SingleTw, index: number) => {
            const publishedAt = new Date();

            const updatedSinglePost = new SingleTw(singleNew);
            if (this.isTwitterItemValid(updatedSinglePost) || this.isAffliatesItemValid(updatedSinglePost)) {
                if (this.slides.length < 3) {
                    this.slides.push(updatedSinglePost);
                }

                if (!this.slides.includes(updatedSinglePost)) {
                    box.items.push(updatedSinglePost);
                    if (box.items.length >= 2 || elements.length === index + 1) {
                        this.twBoxes.push(box);
                        box = new SingleTwBoxes(false);
                    }
                }
            }
        });

    }

    updateNewsBoxes(elements: SingleTw[], socialType: SocialType, previousBoxes: SingleTwBoxes[]) {
        let box = new SingleTwBoxes(false);
        const twBoxes: SingleTwBoxes[] = [];
        const existedBoxes: SingleTwBoxes[] = previousBoxes;
        if (previousBoxes[previousBoxes.length - 1].items.length === 1) {
            box.items.push(previousBoxes[previousBoxes.length - 1].items[0]);
            existedBoxes.splice(previousBoxes.length - 1, 1);
        }
        elements.forEach((singleNew: SingleTw, index: number) => {
            const publishedAt = new Date();
            const updatedSinglePost = new SingleTw(singleNew);
            if (this.isTwitterItemValid(updatedSinglePost) || this.isAffliatesItemValid(updatedSinglePost)) {
                console.log(updatedSinglePost);
                box.items.push(updatedSinglePost);
                if (box.items.length >= 2 || elements.length === index + 1) {
                    twBoxes.push(box);
                    box = new SingleTwBoxes(false);
                }
            }
        });
        this.twBoxes = [...existedBoxes, ...twBoxes];
    }

    isTwitterItemValid(twItem: SingleTw) {
        return twItem.postUrl && twItem.postUrl !== 'None';
    }

    isAffliatesItemValid(element: SingleTw) {
        return element.title && element.type && element.urlToMedia;
    }

    getLastId() {
        if (this.twBoxes.length > 0) {
            const lastBox = this.twBoxes[this.twBoxes.length - 1];
            return lastBox.items[lastBox.items.length - 1].id;
        }
    }
}
