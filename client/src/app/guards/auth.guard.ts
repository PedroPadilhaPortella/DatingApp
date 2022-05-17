import { ToastrMessageService } from 'src/app/services/toastr-message.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from './../services/account.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private accountService: AccountService,
        private toastrMessageService: ToastrMessageService
    ) {}

    canActivate(): Observable<boolean> {
        return this.accountService.currentUser$.pipe(
            map(user => {
                if(user) return true;
                this.toastrMessageService.showWarningToastr( 'You are not alowed to access this page because you are not logged in.');
                return false;
            })
        );
    }

}
