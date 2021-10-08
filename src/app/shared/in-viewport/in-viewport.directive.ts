import { AfterViewInit, Directive, ElementRef, EventEmitter, Host, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[InViewport]'
})
export class InViewportDirective implements AfterViewInit, OnDestroy {
  @Output() visibilityChange: EventEmitter<string> = new EventEmitter<string>();
  private _observer: IntersectionObserver;

  constructor(@Host() private _elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    let threshold = 0.75;
    if (window.innerWidth <= 767) {
      threshold = 0.25;
    }
    console.log('🚀 ~ file: in-viewport.directive.ts ~ line 16 ~ InViewportDirective ~ ngAfterViewInit ~ threshold', threshold);
    const options = { root: null, rootMargin: "0px", threshold };
    this._observer = new IntersectionObserver(this._callback, options);
    this._observer.observe(this._elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this._observer.disconnect();
  }

  private _callback = (entries, observer) => {
    entries.forEach(entry =>
      this.visibilityChange.emit(entry.isIntersecting));
  };
}
