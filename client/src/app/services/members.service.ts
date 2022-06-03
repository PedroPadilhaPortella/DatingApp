import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from './../models/userParams';

@Injectable({
    providedIn: 'root'
})
export class MembersService {
    baseUrl = environment.APIUrl;
    members: Member[] = [];

    constructor(private http: HttpClient) { }

    /**
     * Get all the members from the server with or without pagination.
     * @param userParams The parameters you want to send to the server.
     * @returns `Observable<PaginatedResult<Member>>` The response of the server.
     */
    getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
        let params = this.buildPaginationHeader(userParams.pageNumber, userParams.pageSize);
        
        params = params.append('minAge', userParams.minAge.toString());
        params = params.append('maxAge', userParams.maxAge.toString());
        params = params.append('gender', userParams.gender);

        return this.getPaginatedResult<Member[]>(`${this.baseUrl}/users`, params);
    }

    /**
     * Get a member by username.
     * @param username Username of the Member you are looking for
     * @returns `Observable<Member>`
     */
    getMember(username: string): Observable<Member> {
        const member = this.members.find(x => x.username === username);
        if (member !== undefined) {
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

    /**
     * Delete a photo by it id;
     * @param photoId The id of the photo you want to delete.
     * @returns `Observable<any>` The response of the server.
     */
    deletePhoto(photoId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/users/delete-photo/${photoId}`);
    }

    /**
     * Build the pagination header with pageNumber and PageSize.
     * @param pageNumber The page number you want to get.
     * @param pageSize The size of the page you want to get.
     * @returns `HttpParams` The HttpParams you can use to send to the server.
     */
    private buildPaginationHeader(pageNumber: number, pageSize: number): HttpParams {
        let params = new HttpParams();
        params = params.append('pageNumber', pageNumber.toString());
        params = params.append('pageSize', pageSize.toString());
        return params;
    }

    /**
     * Get a paginated result from the server.
     * @param url The url of the endpoint you want to get.
     * @param params The HttpParams you want to send to the server.
     * @returns `Observable<PaginatedResult<T>>` The response of the server.
     */
    private getPaginatedResult<T>(url: string, params: HttpParams): Observable<PaginatedResult<T>> {
        const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

        return this.http.get<T>(url, { observe: 'response', params })
            .pipe(map((response) => {
                paginatedResult.result = response.body;
                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                }
                return paginatedResult;
            })
        );
    }
}