import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToastrMessageService {

    constructor(private toastr: ToastrService) { }

    showSuccessToastr(title: string, message: string) {
        this.toastr.success(message, title);
    }

    showWarningToastr(message: string) {
        this.toastr.warning(message);
    }

    showErrorToastr(error: any) {
        console.log(error)
        if (error.status === 401) {
            this.toastr.error(error.error)
        } else if (error.status === 400) {
            if (error.error.errors && error.error.errors.Username)
                this.toastr.error(error.error.errors.Username[0])
            else if (error.error.errors && error.error.errors.Password)
                this.toastr.error(error.error.errors.Password[0])
            else
                this.toastr.error(error.error)
        }
        else {
            this.toastr.error("Something went wrong")
        }
    }

}
