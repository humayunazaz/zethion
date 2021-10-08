import { Injectable } from '@angular/core';

import { FacebookService, InitParams } from 'ngx-facebook';

@Injectable()
export class IgServiceWrapperService {

  constructor(
    public instagramService: FacebookService
  ) { }

  init() {
    const initParams: InitParams = {
      appId: '249701322788476',
      xfbml: true,
      version: 'v9.0'
    };
    this.instagramService.init(initParams);
  }
}
