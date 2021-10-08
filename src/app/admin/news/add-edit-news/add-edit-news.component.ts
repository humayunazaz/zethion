import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { listMediaCountry, listMediaLanguage, listTagTypes } from 'src/app/model/results.model';
import { NewsService } from 'src/app/shared/_service/news/news.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-edit-news',
  templateUrl: './add-edit-news.component.html',
  styleUrls: ['./add-edit-news.component.scss']
})
export class AddEditNewsComponent implements OnInit {

  addEditNewsForm: FormGroup;
  loading: boolean;
  countries = listMediaCountry().slice(1);
  languages = listMediaLanguage();
  tagTypes: any = listTagTypes().slice(1);
  isEdit: boolean;
  isCopy: boolean;
  public Editor = ClassicEditor;

  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private matDialogRef: MatDialogRef<AddEditNewsComponent>,
  ) {
    this.loading = false;
    this.isEdit = false;
    this.isCopy = false;
    if (this.data && this.data.hasOwnProperty('isEdit') && this.data.isEdit) {
      this.isEdit = true;
    } else if (this.data && this.data.hasOwnProperty('isCopy') && this.data.isCopy) {
      this.isCopy = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (this.isEdit || this.isCopy) {
      this.getFormData();
    } else {
      this.addTag();
    }
  }

  private createForm(): void {
    this.addEditNewsForm = this.formBuilder.group({
      multiCountry: [false],
      newsType: ['OWN_NEWS'],
      sourceId: [1],
      language: ['', Validators.required],
      countryCode: ['', Validators.required],
      author: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', Validators.compose([
        Validators.required,
        this.noWhitespaceValidator
      ])],
      urlToMedia: ['', Validators.compose([
        Validators.required,
        Validators.pattern('(https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})'),
        this.urlExtensionValidator.bind(this)
      ])],
      mediaType: [''],
      publishedAt: [''],
      sport: ['', Validators.required],
      tags: this.formBuilder.array([]),
    });
  }

  private noWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    if (!isWhitespace) {
      return null;
    }
    return { 'whitespace': true };
  }


  private urlExtensionValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (this.getUrlToMediaExtension(control.value)) {
      return null;
    }
    return { 'invalidExtension': true }
  }

  private getFormData(): void {
    console.log('getFormData', this.data.news);
    this.addEditNewsForm.patchValue({
      multiCountry: this.data.news.multiCountry,
      language: this.data.news.language,
      countryCode: this.data.news.countryCode,
      author: this.data.news.author,
      title: this.data.news.title,
      description: this.data.news.description,
      content: this.data.news.content,
      urlToMedia: this.data.news.urlToMedia,
      mediaType: this.data.news.mediaType,
      publishedAt: this.data.news.publishedAt,
      sport: this.data.news.sourceSport
    });
    if (this.isEdit) {
      this.addEditNewsForm.controls.multiCountry.disable();
    }
    this.toggleMultiCountry();
    console.log('🚀   ~ file: add-edit-news.component.ts ~ line 112 ~ AddEditNewsComponent ~ getFormData ~ this.data.news', this.data.news);
    if (this.data.news.tags.length) {
      this.removeAll();
      const tags = this.addEditNewsForm.controls.tags as any;
      const sortedTags = this.data.news.tags.filter((tag) => tag.type !== 'SPORT' || ((tag.type === 'SPORT' && tag.sport !== this.data.news.sourceSport) && tag.idRef !== 1)).sort((previous, next) => previous.id > next.id ? -1 : 1);
      console.log('🚀 ~ file: add-edit-news.component.ts ~ line 115 ~ AddEditNewsComponent ~ getFormData ~ sortedTags', sortedTags);
      const filteredTags = sortedTags.filter((tag, index) => sortedTags.findIndex(data => {
        return (data.type === 'GENERAL' && data.keyword === tag.keyword) || (data.type !== 'GENERAL' && data.type !== 'SPORT' && data.idRef === tag.idRef) || (data.type === 'SPORT' && data.sport === tag.sport);
      }) === index).map((tag) => {
        if (tag.type !== 'SPORT' && tag.type !== 'GENERAL') {
          console.log('🚀 ~ file: add-edit-news.component.ts ~ line 116 ~ AddEditNewsComponent ~ filteredTags ~ tag', tag);
          return {
            type: tag.type,
            idRef: tag.type !== undefined ? tag[tag.type.toLowerCase()] : null,
            keyword: null
          }
        } else if (tag.type === 'SPORT') {
          return {
            type: tag.type,
            idRef: tag.sport,
            keyword: null
          }
        }
        return {
          type: 'GENERAL',
          idRef: null,
          keyword: tag.keyword
        }
      });
      console.log('🚀 ~ file: add-edit-news.component.ts ~ line 116 ~ AddEditNewsComponent ~ filteredTags ~ filteredTags', filteredTags);
      for (let index = 0; index < filteredTags.length; index += 1) {
        this.addTag();
        tags.controls[index].patchValue({
          type: filteredTags[index].type,
          idRef: filteredTags[index].type !== 'SPORT' ? filteredTags[index].type === 'GENERAL' ? null : filteredTags[index].idRef : filteredTags[index].idRef,
          keyword: filteredTags[index].type === 'GENERAL' ? filteredTags[index].keyword : null
        });
      }
    } else {
      this.addTag();
    }
  }

  private createTagGroup(): FormGroup {
    return this.formBuilder.group({
      type: [''],
      idRef: [''],
      keyword: ['']
    });
  }

  addTag(): void {
    const control = this.addEditNewsForm.controls.tags as any;
    control.push(this.createTagGroup());
  }

  removeTag(index: number): void {
    const control = this.addEditNewsForm.controls.tags as any;
    control.removeAt(index);
  }

  removeAll(): void {
    const control = this.addEditNewsForm.controls.tags as any;
    while (control.length !== 0) {
      control.removeAt(0)
    }
  }

  getTagControl() {
    return (this.addEditNewsForm.get('tags') as any).controls;
  }

  toggleMultiCountry() {
    if (!this.addEditNewsForm.value.multiCountry) {
      this.addEditNewsForm.controls.language.setValidators(Validators.required);
      this.addEditNewsForm.controls.language.enable();
      this.addEditNewsForm.controls.language.updateValueAndValidity();
      this.addEditNewsForm.controls.countryCode.setValidators(Validators.required);
      this.addEditNewsForm.controls.countryCode.enable();
      this.addEditNewsForm.controls.countryCode.updateValueAndValidity();
    } else {
      this.addEditNewsForm.controls.language.clearValidators();
      this.addEditNewsForm.controls.language.disable();
      this.addEditNewsForm.controls.language.setValue(null);
      this.addEditNewsForm.controls.language.updateValueAndValidity();
      this.addEditNewsForm.controls.countryCode.clearValidators();
      this.addEditNewsForm.controls.countryCode.disable();
      this.addEditNewsForm.controls.countryCode.setValue(null);
      this.addEditNewsForm.controls.countryCode.updateValueAndValidity();
    }
  }

  typeChanged(index: number): void {
    console.log('type changed');
    const tagsControl = this.addEditNewsForm.controls.tags as any;
    if (tagsControl.controls[index].value.type && tagsControl.controls[index].value.type !== 'GENERAL') {
      tagsControl.controls[index].controls.idRef.reset();
    }
  }

  submit(): void {
    console.log('===== submit', this.addEditNewsForm.value);
    if (!this.addEditNewsForm.valid || !this.addEditNewsForm.controls.tags.valid) {
      Object.keys(this.addEditNewsForm.controls).forEach(field => {
        const control = this.addEditNewsForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      const tagsControl = this.addEditNewsForm.controls.tags as any;
      tagsControl.controls.forEach((value, key) => {
        Object.keys(tagsControl.controls[key].controls).forEach(field => {
          const control = tagsControl.controls[key].get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      });
    } else {
      this.loading = true;
      const data = this.addEditNewsForm.value;
      const tags = [
        {
          type: 'SPORT',
          idRef: null,
          sport: data.sport,
          keyword: null
        },
        {
          type: 'MEDIA',
          idRef: 1,
          keyword: null,
          sport: null
        }
      ];
      tags.push(...data.tags.filter((tag) => tag.type === 'GENERAL' || (tag.type !== 'GENERAL' && tag.idRef)).map((tag) => {
        return {
          type: tag.type,
          idRef: tag.type !== 'SPORT' ? tag.type === 'GENERAL' ? null : tag.idRef.id : null,
          sport: tag.type === 'SPORT' ? tag.idRef : null,
          keyword: tag.type === 'GENERAL' ? tag.keyword.toUpperCase().split(' ').join('_') : null
        }
      }));
      let filteredTags;
      filteredTags = tags.filter((tag, index) => tags.findIndex(data => {
        return (data.type !== 'GENERAL' && data.type !== 'SPORT' && data.idRef === tag.idRef) || (data.type === 'SPORT' && data.sport === tag.sport) || (data.type === 'GENERAL' && data.keyword === tag.keyword);
      }) === index).map((tag) => {
        return {
          ...tag
        }
      });
      data.tags = filteredTags;
      data.mediaType = this.getUrlToMediaExtension(data.urlToMedia);
      if (this.isEdit) {
        data.id = this.data.news.id;
        data.publishedAt = moment(new Date(data.publishedAt)).format('YYYY-MM-DD[T]HH:mm:ss');
      } else {
        data.publishedAt = moment(new Date()).format('YYYY-MM-DD[T]HH:mm:ss');
      }
      const title = data.title
        .replace(/[$&+,:;=\\?@#|/'<>.^*()%!-\"\.]/g, ' ').split(' ')
        .filter((ele: string) => ele)
        .map((ele: string) => ele.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
        .join('-');
      data.url = `https://zethion.com/curiosities/${data.sport.toLowerCase()}/${moment(new Date(data.publishedAt)).format('YYYY-MM-DD')}/${title}`;
      this.newsService.saveNew(data)
        .subscribe((response) => {
          console.log('🚀 ~ file: add-edit-news.component.ts ~ line 153 ~ AddEditNewsComponent ~ .subscribe ~ response', response);
          this.loading = false;
          this.matDialogRef.close(true);
        }, (error) => {
          console.log('🚀 ~ file: add-edit-news.component.ts ~ line 157 ~ AddEditNewsComponent ~ .subscribe ~ error', error);
          this.loading = false;
        });
    }
  }

  private getUrlToMediaExtension(url: string): string | null {
    const extension = url.split(/[#?]/)[0].split('.').pop().trim();
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
      return 'IMAGE';
    } else if (extension === 'mp4') {
      return 'VIDEO';
    }
    return null;
  }

  countWords(content: string): string {
    if (content.trim().length) {
      const spaceCount = content.split(' ').length - 1;
      const wordCount = content.trim().split(/\s+/).length;
      const totalCount = spaceCount + wordCount;
      if (totalCount > 1) {
        return `${totalCount} words`;
      }
      return `${totalCount} word`;
    }
    return '0 word';
  }

}
