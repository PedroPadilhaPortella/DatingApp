import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Photo } from '../models/photo';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    baseUrl = environment.APIUrl;

    constructor(private http: HttpClient) { }

    getUsersWithRoles(): Observable<Partial<User[]>> {
        return this.http.get<Partial<User[]>>(`${this.baseUrl}/admin/users-with-roles`);
    }

    updateUserRoles(username: string, roles) {
        return this.http.post(`${this.baseUrl}/admin/edit-roles/${username}?roles=${roles}`, {});
    }

    getPhotosForApproval() {
        return this.http.get<Photo[]>(this.baseUrl + '/admin/photos-to-moderate');
    }

    approvePhoto(photoId: number) {
        return this.http.post(this.baseUrl + '/admin/approve-photo/' + photoId, {});
    }

    rejectPhoto(photoId: number) {
        return this.http.post(this.baseUrl + '/admin/reject-photo/' + photoId, {});
    }
}
