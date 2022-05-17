import { AccountService } from './../services/account.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../models/user';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    model: any = {};
    @Output('closeRegister') closeRegister = new EventEmitter();

    constructor(private accountService: AccountService) { }

    ngOnInit(): void {}

    register() {
        this.accountService.register(this.model).subscribe({
            next: (_) =>  this.close(),
            error: (error) => console.log(error)
        });
    }

    close() {
        this.closeRegister.emit();
    }
}
