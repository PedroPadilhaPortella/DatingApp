import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../services/account.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrMessageService } from 'src/app/services/toastr-message.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    model: any = {};
    @Output('closeRegister') closeRegister = new EventEmitter();

    constructor(
        private accountService: AccountService,
        private toastrMessageService: ToastrMessageService,
    ) { }

    ngOnInit(): void {}

    register() {
        this.accountService.register(this.model).subscribe({
            next: (_) =>  {
                this.close()
                this.toastrMessageService.showSuccessToastr('Success', 'You are registered')
            },
            error: (errors) => {
                this.toastrMessageService.showErrorToastr(errors);
            }
        });
    }

    close() {
        this.closeRegister.emit();
    }
}
