import { AccountService } from './../services/account.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    model: any = { username: 'pedro', password: 'Am@terasu1' }

    constructor(public accountService: AccountService) { }

    ngOnInit(): void {}

    login() {
        this.accountService.login(this.model)
            .subscribe({
                next: (response) => {
                    console.log(this.model)
                    console.log(response)
                    this.model = {}
                },
                error: (error) => {
                    console.log(error)
                }
            })
    }

    logout() {
        this.accountService.logout()
    }
}
