import { Injectable } from '@angular/core';


declare interface LogoImage {
  [key: string]: HTMLImageElement;
}

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor() { }

  public images: LogoImage = {};


  preload(preload) {
    for (let i = 0; i < preload.length; i++) {
      const value = preload[i].split('/');
      const id = value[value.length - 1].split('.')[0];
      this.images[id] = new Image();
      this.images[id].src = preload[i];
    }
  }
}
