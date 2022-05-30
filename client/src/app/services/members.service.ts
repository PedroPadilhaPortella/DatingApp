import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
    providedIn: 'root'
})
export class MembersService {
    baseUrl = environment.APIUrl;
    members: Member[] = [];

    constructor(private http: HttpClient) { }

    /**
     * Get the List of all members.
     * @returns `Member[]` A List of all members.
     */
    getMembers(): Observable<Member[]> {
        if(this.members.length > 0) {
            return of(this.members);
        }
        return this.http.get<Member[]>(`${this.baseUrl}/users`).pipe(
            map((members: Member[]) => {
                this.members = members
                return members;
            })
        );
    }

    /**
     * Get a member by username.
     * @param username Username of the Member you are looking for
     * @returns `Observable<Member>`
     */
    getMember(username: string): Observable<Member> {
        const member = this.members.find(x => x.username === username);
        if(member !== undefined) {
            return of(member);
        }
        return this.http.get<Member>(`${this.baseUrl}/users/${username}`);
    }

    /**
     * Update a member and then, update him on the list of members.
     * @param member the member you want to update.
     * @returns `Observable<any>` The response of the server.
     */
    updateMember(member: Member): Observable<any> {
        return this.http.put(`${this.baseUrl}/users`, member).pipe(
            map(() => {
                const index = this.members.indexOf(member);
                this.members[index] = member;
            })
        );
    }
    
    /**
     * Set a photo as the profile/main photo of a member.
     * @param photoId The id of the photo you want to set as main photo.
     * @returns `Observable<any>` The response of the server.
     */
    setMainPhoto(photoId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/users/set-main-photo/${photoId}`, {});
    }
}