import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetaData } from 'src/app/model/meta-data.model';

@Injectable({
  providedIn: 'root'
})
export class MetaService {


  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  setMetaTags(meta: MetaData) {
    let metaDescription = meta.description.substr(0, 52);
    metaDescription = metaDescription.substr(0, Math.min(metaDescription.length, metaDescription.lastIndexOf(" "))) + '...';
    let description = meta.description.substr(0, 147);
    description = description.substr(0, Math.min(description.length, description.lastIndexOf(" "))) + '...';
    this.getImageDimension(meta.image);
    this.title.setTitle(`${meta.title} - Zethion`);
    this.meta.updateTag({ property: 'title', content: `${meta.title}` });
    this.meta.updateTag({ property: 'og:title', content: `${meta.title}` });
    this.meta.updateTag({ name: 'twitter:title', content: `${meta.title}` });
    if (meta.description) {
      this.meta.updateTag({ property: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: metaDescription });
      this.meta.updateTag({ name: 'twitter:description', content: metaDescription });
    }
    if (meta.image) {
      this.meta.updateTag({ property: 'og:image', content: meta.image });
      this.meta.updateTag({ name: 'twitter:image', content: meta.image });
    }

  }

  setDefaultMetaTags() {
    this.title.setTitle('Zethion');

    this.meta.updateTag({ property: 'og:title', content: 'Zethion' });
    this.meta.updateTag({ property: 'og:description', content: 'Let\'s Sport' });
    this.meta.updateTag({ property: 'og:image', content: `https://zethion.com/assets/img/minilyre.png` });
      this.meta.updateTag({ property: 'og:image:width', content: '250' });
      this.meta.updateTag({ property: 'og:image:height', content: '250' });

    this.meta.updateTag({ name: 'twitter:title', content: 'Zethion' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Let\'s Sport' });
    this.meta.updateTag({ name: 'twitter:image', content: `https://zethion.com/assets/img/minilyre.png` });

    this.meta.updateTag({ property: 'title', content: 'Zethion' });
    this.meta.updateTag({ property: 'description', content: 'Zethion revolutionizes the telematic world sport. Stories, news, remote games and artificial intelligence tools will engage you in something unique and exciting' });
  }

  private getImageDimension(src: string) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      this.meta.updateTag({ property: 'og:image:width', content: img.width.toString() });
      this.meta.updateTag({ property: 'og:image:height', content: img.height.toString() });
    }
  }

}
