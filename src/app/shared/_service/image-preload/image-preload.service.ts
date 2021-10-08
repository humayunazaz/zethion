import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

type url = string;

@Injectable({
  providedIn: 'root'
})
export class ImagePreloadService {

  public imageUrls: url[] = [];
  private _imageErrorUrls = new Set<url>();

  private _imageLoaded$ = new Subject<url>();
  public get imageLoaded$() {
    return this._imageLoaded$.asObservable();
  }

  private _imageError$ = new Subject<url>();
  public get imageError$() {
    return this._imageError$.asObservable();
  }

  constructor() { }

  notifyImageLoaded(imageUrl: url) {
    this._imageLoaded$.next(imageUrl);
  }
  notifyImageError(imageUrl: url) {
    this._imageErrorUrls.add(imageUrl);
    this.deleteImage(imageUrl);
    this._imageError$.next(imageUrl);
  }

  getImageLoadedObservable(imageUrl: url) {
    return this.imageLoaded$.pipe(
      filter(imUrl => imUrl === imageUrl),
      map(_imUrl => true)
    );
  }
  getImageErrorObservable(imageUrl: url) {
    return this.imageError$.pipe(
      filter(imUrl => imUrl === imageUrl),
      map(_imUrl => true)
    );
  }

  loadImage(imageUrl: url) {
    if (imageUrl && !this.isInImages(imageUrl) && !this._imageErrorUrls.has(imageUrl)) {
      this.addImage(imageUrl);
    }
  }
  isErrorImage(imageUrl: url) {
    return this._imageErrorUrls.has(imageUrl);
  }

  private isInImages(imageUrl: url) {
    return this.imageUrls.includes(imageUrl);
  }
  private addImage(imageUrl: url) {
    this.imageUrls.push(imageUrl);
  }
  private deleteImage(imageUrl: url) {
    this.imageUrls = this.imageUrls.filter(im => im !== imageUrl);
  }
}
