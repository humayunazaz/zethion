import { Pipe, PipeTransform } from '@angular/core';
import { unescape } from 'lodash-es';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  transform(value: string): string {
    return unescape(value);
  }

}
