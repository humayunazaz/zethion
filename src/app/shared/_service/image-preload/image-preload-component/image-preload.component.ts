import { Component, OnInit } from '@angular/core';

import { ImagePreloadService } from 'src/app/shared/_service/image-preload/image-preload.service';

@Component({
  selector: 'app-image-preload',
  templateUrl: './image-preload.component.html',
  styleUrls: ['./image-preload.component.scss']
})
export class ImagePreloadComponent implements OnInit {

  constructor(
    public imagePreloadService: ImagePreloadService
  ) { }

  ngOnInit(): void {
  }

  notifyImageError(imageUrl: string) {
    this.imagePreloadService?.notifyImageError(imageUrl);
  }
  notifyImageLoaded(imageUrl: string) {
    this.imagePreloadService?.notifyImageLoaded(imageUrl);
  }

}
