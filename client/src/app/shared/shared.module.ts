import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        BsDropdownModule.forRoot(),
        ToastrModule.forRoot({ positionClass: 'toast-bottom-right', preventDuplicates: true, }),
        TabsModule.forRoot(),
        NgxGalleryModule,
        NgxSpinnerModule,
        FileUploadModule,
        BsDatepickerModule.forRoot(),
    ],
    exports: [
        BsDropdownModule,
        ToastrModule,
        TabsModule,
        NgxGalleryModule,
        NgxSpinnerModule,
        FileUploadModule,
        BsDatepickerModule,
    ]
})
export class SharedModule { }
