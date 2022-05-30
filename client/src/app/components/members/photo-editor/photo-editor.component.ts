import { Photo } from './../../../models/photo';
import { MembersService } from './../../../services/members.service';
import { environment } from 'src/environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Member } from 'src/app/models/member';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models/user';
import { take } from 'rxjs';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
    @Input("member") member: Member;
    user: User;
    uploader: FileUploader;
    hasBaseDropZoneOver = false;
    baseUrl = environment.APIUrl;

    constructor(private accountService: AccountService, private memberService: MembersService) {
        this.accountService.currentUser$.pipe(take(1))
            .subscribe((user: User) => this.user = user);
    }

    ngOnInit(): void {
        this.initializeUploader();
    }

    /**
     * Initialize the photo uploader.
     */
    initializeUploader() {
        this.uploader = new FileUploader({
            url: `${this.baseUrl}/users/add-photo`,
            authToken: `Bearer ${this.user.token}`,
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: (10 * 1024 * 1024),
        });

        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        }

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            if (response) {
                const photo = JSON.parse(response);
                this.member.photos.push(photo);
            }
        }
    }

    /**
     * Check is a photo has been dropped on the image dropzone.
     * @param e 
     */
    fileOverBase(e: any) {
        this.hasBaseDropZoneOver = e;
    }

    /**
     * Update the mainPhoto of the member when the button is selected, and then, 
     * update the member in the localStorage and in the State.
     * @param photo
     */
    setMainPhoto(photo: Photo) {
        this.memberService.setMainPhoto(photo.id).subscribe(() => {
                this.user.photoUrl = photo.url;
                this.accountService.setCurrentUser(this.user);
                this.member.photoUrl = photo.url;
                this.member.photos.forEach(p => {
                    if (p.isMain) p.isMain = false;
                    if (p.id === photo.id) p.isMain = true;
                });
        });
    }

    deletePhoto(photo: Photo) {
        this.memberService.deletePhoto(photo.id).subscribe(() => {
            this.member.photos = this.member.photos.filter(p => p.id !== photo.id);
        });
    }
}
