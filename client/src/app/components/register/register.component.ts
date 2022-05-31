import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrMessageService } from 'src/app/services/toastr-message.service';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    @Output('closeRegister') closeRegister = new EventEmitter();
    registerForm: FormGroup;
    maxDate: Date;
    validationErrors: string[] = [];

    constructor(
        private accountService: AccountService,
        private toastrMessageService: ToastrMessageService,
        private fb: FormBuilder,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.maxDate = new Date();
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
        this.initializeForm();
    }

    initializeForm() {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required]],
            gender: ['male'],
            knownAs: ['', [Validators.required]],
            dateOfBirth: [new Date(1970, 0, 1), [Validators.required]],
            city: ['', [Validators.required]],
            country: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$')]],
            confirmPassword: ['', [Validators.required, this.matchValues('password')]],
        });

        this.registerForm.controls.password.valueChanges.subscribe(() => {
            this.registerForm.controls.confirmPassword.updateValueAndValidity();
        })
    }

    matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl) => {
            return control?.value === control?.parent?.controls[matchTo].value
                ? null : { isMatching: true }
        }
    }

    register() {
        if (this.registerForm.valid) {
            this.accountService.register(this.registerForm.value).subscribe({
                next: (_) => {
                    this.close()
                    this.router.navigateByUrl('/members')
                    this.toastrMessageService.showSuccessToastr('Success', 'You are registered')
                },
                error: (errors) => {
                    console.warn(errors)
                    this.validationErrors = errors;
                    this.toastrMessageService.showErrorToastr(errors);
                }
            });
        }
    }

    close() {
        this.closeRegister.emit();
    }
}
