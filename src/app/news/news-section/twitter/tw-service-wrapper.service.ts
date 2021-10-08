import { Injectable } from '@angular/core';

import { FacebookService, InitParams } from 'ngx-facebook';

@Injectable()
export class TwServiceWrapperService {

  constructor(
    public twitterService: FacebookService
  ) { }

  init() {
    const initParams: InitParams = {
      appId: '249701322788476',
      xfbml: true,
      version: 'v9.0'
    };
    this.twitterService.init(initParams);
  }
}
