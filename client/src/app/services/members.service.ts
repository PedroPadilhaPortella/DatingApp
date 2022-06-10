import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, take } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { User } from '../models/user';
import { UserParams } from './../models/userParams';
import { PaginationService } from './pagination.service';

@Injectable({
    providedIn: 'root'
})
export class MembersService {
    baseUrl = environment.APIUrl;
    members: Member[] = [];
    memberCache = new Map();

    userParams: UserParams;
    user: User;

    constructor(
        private http: HttpClient, 
        private accountService: AccountService, 
        private paginationService: PaginationService,
    ) {
        this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
            this.user = user;
            this.userParams = new UserParams(user);
        });
    }
    
    getUserParams = () => this.userParams;

    setUserParams = (params: UserParams) => this.userParams = params;

    resetUserParams = () => {
        this.userParams = new UserParams(this.user);
        return this.userParams;
    }

    /**
     * Get all the members from the server with or without pagination.
     * If there is a pagination, it will return a paginated result.
     * If there is a cache of members with the same paginated properties, it will return the cache.
     * @param userParams The parameters you want to send to the server.
     * @returns `Observable<PaginatedResult<Member>>` The response of the server.
     */
    getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> 
    {
        var response = this.memberCache.get(Object.values(userParams).join('-'));
        if(response) return of(response);

        let params = this.paginationService
            .buildPaginationHeader(userParams.pageNumber, userParams.pageSize);
        
        params = params.append('minAge', userParams.minAge.toString());
        params = params.append('maxAge', userParams.maxAge.toString());
        params = params.append('gender', userParams.gender);
        params = params.append('orderBy', userParams.orderBy);

        return this.paginationService
            .getPaginatedResult<Member[]>(`${this.baseUrl}/users`, params)
            .pipe(map(response => {
                this.memberCache.set(Object.values(userParams).join('-'), response);
                return response;
            }));
    }

    /**
     * Get a member by username.
     * @param username Username of the Member you are looking for
     * @returns `Observable<Member>`
     */
    getMember(username: string): Observable<Member> {
        const member = [...this.memberCache.values()]
            .reduce((arr, elem) => arr.concat(elem.result), [])
                .find((member: Member) => member.username == username);
        
        if(member) return of(member);
        
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

    /**
     * Delete a photo by it id;
     * @param photoId The id of the photo you want to delete.
     * @returns `Observable<any>` The response of the server.
     */
    deletePhoto(photoId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/users/delete-photo/${photoId}`);
    }

    addLike(username: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/likes/${username}`, {});
    }
    
    getLikes(predicate: string, pageNumber: number, pageSize: number)
    : Observable<PaginatedResult<Partial<Member[]>>>
    {
        let params = this.paginationService
            .buildPaginationHeader(pageNumber, pageSize);
            
        params = params.append('predicate', predicate);

        return this.paginationService
            .getPaginatedResult<Partial<Member[]>>(`${this.baseUrl}/likes`, params);
    }
}