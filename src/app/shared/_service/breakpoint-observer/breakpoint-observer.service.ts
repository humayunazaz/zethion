import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Breakpoint = 'none'| 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {

  private _breakPoints$ = new BehaviorSubject<Breakpoint>('none');
  get breakPoints$() {
    return this._breakPoints$.asObservable();
  }

  constructor() { }

  emitBreakpoint(bp: Breakpoint) {
    this._breakPoints$.next(bp);
  }

}
