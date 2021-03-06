import { take } from 'rxjs';
import { AccountService } from './../services/account.service';
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { User } from '../models/user';

@Directive({
    selector: '[appHasRole]' // *appHasRole=[role]
})
export class HasRoleDirective implements OnInit {
    @Input('appHasRole') appHasRole:  string[];
    user: User;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private accountService: AccountService
    ) {
        this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit(): void {
        if(!this.user?.roles || this.user == null) {
            this.viewContainerRef.clear();
            return;
        }

        if(this.user.roles.some(r => this.appHasRole.includes(r))) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainerRef.clear();
        }
    }

}
