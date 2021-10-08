import { SocialType } from "../social-type";

export class SingleFbBoxes {
	constructor(hidden: boolean) {
		this.hidden = hidden;
		this.items = [];
	}
	hidden: boolean;
	items: SingleFb[];
}

export class SocialPage {
	constructor(name: string, idRef: number, pageType: string, sport: string) {
		this.socialPageUsername = name;
		this.idRef = idRef;
		this.pageType = pageType;
		this.sport = sport;
	}
	socialPageUsername: string;
	idRef: number;
	pageType: string;
	sport: string;
}

export class SingleFb {
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
			this.socialPage = new SocialPage(element.socialPage.socialPageUsername, element.socialPage.idRef, element.socialPage.pageType, element.socialPage.sport);
			this.publishedAt = element.publishedAt;
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
		this.withOutThumbnail = false;
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

export class FacebookContent {
	constructor(
		content: SingleFb[],
		socialType: SocialType, recurring: boolean, previousBoxes?: SingleFbBoxes[]
	) {
		this.slides = [];
		this.fbBoxes = [];
		recurring ? this.updateNewsBoxes(content, socialType, previousBoxes) : this.getSlidesBoxes(content);
	}
	slides: SingleFb[];
	fbBoxes: SingleFbBoxes[];
	getSlidesBoxes(elements: SingleFb[]) {
		let box = new SingleFbBoxes(false);
		elements.forEach((singleNew: SingleFb, index: number) => {
			const publishedAt = new Date();

			const updatedSinglePost = new SingleFb(singleNew);
			if (this.isFacebookItemValid(updatedSinglePost) || this.isAffliatesItemValid(updatedSinglePost)) {
				if (this.slides.length < 3) {
					this.slides.push(updatedSinglePost);
				}

				if (!this.slides.includes(updatedSinglePost)) {
					box.items.push(updatedSinglePost);
					if (box.items.length >= 2 || elements.length === index + 1) {
						this.fbBoxes.push(box);
						box = new SingleFbBoxes(false);
					}
				}
			}
		});

	}

	updateNewsBoxes(elements: SingleFb[], socialType: SocialType, previousBoxes: SingleFbBoxes[]) {
		let box = new SingleFbBoxes(false);
		const fbBoxes: SingleFbBoxes[] = [];
		const existedBoxes: SingleFbBoxes[] = previousBoxes;
		if (previousBoxes[previousBoxes.length - 1].items.length === 1) {
			box.items.push(previousBoxes[previousBoxes.length - 1].items[0]);
			existedBoxes.splice(previousBoxes.length - 1, 1);
		}
		elements.forEach((singleNew: SingleFb, index: number) => {
			const publishedAt = new Date();
			const updatedSinglePost = new SingleFb(singleNew);
			if (this.isFacebookItemValid(updatedSinglePost) || this.isAffliatesItemValid(updatedSinglePost)) {
				console.log(updatedSinglePost);
				box.items.push(updatedSinglePost);
				if (box.items.length >= 2 || elements.length === index + 1) {
					fbBoxes.push(box);
					box = new SingleFbBoxes(false);
				}
			}
		});
		this.fbBoxes = [...existedBoxes, ...fbBoxes];
	}

	isFacebookItemValid(fbItem: SingleFb) {
		return fbItem.postUrl && fbItem.postUrl !== 'None';
	}

	isAffliatesItemValid(element: SingleFb) {
		return element.title && element.type && element.urlToMedia;
	}

	getLastId() {
		if (this.fbBoxes.length > 0) {
			const lastBox = this.fbBoxes[this.fbBoxes.length - 1];
			return lastBox.items[lastBox.items.length - 1].id;
		}
	}
}
