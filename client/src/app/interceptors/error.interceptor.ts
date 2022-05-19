import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrMessageService } from '../services/toastr-message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private toastrMessageService: ToastrMessageService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError(error => {
                if (error) {
                    switch (error.status) {
                        case 400:
                            if (error.error.errors) {
                                const modalStateErrors = [];
                                for (const key in error.error.errors) {
                                    if (error.error.errors[key]) {
                                        modalStateErrors.push(error.error.errors[key]);
                                    }
                                }
                                throw modalStateErrors.flat();
                            } else {
                                this.toastrMessageService.showDangerToastr(error.statusText === 'OK' ? 'Bad Request' : error.statusText, error.status);
                            }
                            break;
                        case 401:
                            this.toastrMessageService.showDangerToastr(error.statusText === 'OK' ? 'Unauthorized' : error.statusText, error.status);
                            break;
                        case 404:
                            this.toastrMessageService.showDangerToastr("Page Not Found", null);
                            this.router.navigateByUrl('/not-found');
                            break;
                        case 500:
                            this.toastrMessageService.showDangerToastr("An Server Error Occurred", "500");
                            const navigationExtras: NavigationExtras = { state: { error: error.error } };
                            this.router.navigateByUrl('/server-error', navigationExtras);
                            break;
                        default:
                            this.toastrMessageService.showDangerToastr("Something went wrong", null);
                            console.warn(error);
                            break;
                    }
                }
                return throwError(() => error);
            })
        );
    }
}
