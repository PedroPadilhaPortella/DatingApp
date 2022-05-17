import { ToastrMessageService } from './../../services/toastr-message.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    model: any = { username: 'pedro', password: 'Am@terasu1' }

    constructor(
        public accountService: AccountService, 
        private router: Router,
        private toastrMessageService: ToastrMessageService,
    ) { }

    ngOnInit(): void {}

    login() {
        this.accountService.login(this.model)
            .subscribe({
                next: (_) => {
                    this.router.navigateByUrl('/members')
                    this.toastrMessageService.showSuccessToastr(`Welcome  ${this.model.username}`, 'You are logged in')
                    this.model = {}
                },
                error: (error) => {
                    this.toastrMessageService.showErrorToastr(error);
                }
            })
    }
    
    logout() {
        this.accountService.logout()
        this.router.navigateByUrl('/')
    }
}
