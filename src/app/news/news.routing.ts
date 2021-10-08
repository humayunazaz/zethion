import { Routes } from '@angular/router';

import { NewsSectionComponent } from './news-section/news-section.component';
import { ModalOpeningContainerComponent } from './news-section/modal-container/modal-container.component';

export const NewsRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: '',
        component: NewsSectionComponent,
        children: [
          {
            path: 'posts/:sport/:date/facebook/:title/:postId',
            component: ModalOpeningContainerComponent,
            data: {
              socialType: 'facebook'
            }
          },
          {
            path: 'posts/:sport/:date/twitter/:title/:tweetId',
            component: ModalOpeningContainerComponent,
            data: {
              socialType: 'twitter'
            }
          },
          {
            path: 'posts/:sport/:date/instagram/:title/:igId',
            component: ModalOpeningContainerComponent,
            data: {
              socialType: 'instagram'
            }
          },
          {
            path: 'posts/:sport/:date/youtube/:title/:ytId',
            component: ModalOpeningContainerComponent,
            data: {
              socialType: 'youtube'
            }
          },
          {
            path: ':sport/:date/:title/:newsId',
            component: ModalOpeningContainerComponent,
            data: {
              socialType: 'news'
            }
          }
        ]
      }
    ]
  }
];
