import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToastrMessageService {

    constructor(private toastr: ToastrService) { }

   /**
    * Show a success toastr
    * @param title the title of the toastr, if not provided, the toast will be without title
    * @param message the message of the toastr
    */ 
    showSuccessToastr(title: string, message: string) {
        this.toastr.success(message, title);
    }

    /**
     * Show a warning toastr
     * @param message the message of the toastr
     */
    showWarningToastr(message: string) {
        this.toastr.warning(message);
    }

    /**
    * Show a danger toastr
    * @param title the title of the toastr, if not provided, the toast will be without title
    * @param message the message of the toastr
    */ 
    showDangerToastr(title: string, message: string) {
        this.toastr.error(message, title);
    }

    /**
     * Show an error toastr will a list of errors from the form.
     * @param errors a list of all the errors of the form
     */
    showErrorToastr(errors: string[]) {
        errors.forEach(error =>  this.toastr.error(error));
    }

}
