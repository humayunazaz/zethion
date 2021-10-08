import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core"
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { MessageToastrComponent } from '../../message-toastr/message-toastr.component';

@Injectable()
export class MessageInterceptor implements HttpInterceptor {
  constructor(
    private dialog: MatDialog
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          if (evt.hasOwnProperty('body') && evt.body) {
            const body = evt.body;
            if (body.hasOwnProperty('success') && body.success) {
              let message = 'SUCCESS';
              if (body.message && body.message !== 'USER_CREATED') {
                message = body.message;
                this.showMessageToastr('Success', message, true);
              }
            }
          }
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.hasOwnProperty('error') && err.error) {
            const error = err.error;
            if (error.hasOwnProperty('success') && !error.success) {
              let message = error.message;
              console.log('🚀 ~ file: message.interceptor.ts ~ line 23 ~ MessageInterceptor ~ message', message);
              this.showMessageToastr('Error', message, false);
            }
          }
        }
        return throwError(err);
      }));
  }

  private showMessageToastr(title: string, message: string, dismissAutomatically: boolean) {
    const dialogRef = this.dialog.open(MessageToastrComponent, {
      panelClass: 'message-toastr',
      width: '300px',
      height: '150px',
      hasBackdrop: false,
      position: {
        top: '20px',
        right: '20px'
      },
      data: {
        title,
        message
      }
    });
    if (dismissAutomatically) {
      setTimeout(() => {
        dialogRef.close();
      }, 2000);
    }
  }

}