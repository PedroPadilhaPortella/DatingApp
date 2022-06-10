import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { PaginatedResult } from "../models/pagination";

@Injectable({
    providedIn: 'root'
})
export class PaginationService {

    constructor(private http: HttpClient) { }

    /**
     * Build the pagination header with pageNumber and PageSize.
     * @param pageNumber The page number you want to get.
     * @param pageSize The size of the page you want to get.
     * @returns `HttpParams` The HttpParams you can use to send to the server.
     */
    public buildPaginationHeader(pageNumber: number, pageSize: number): HttpParams {
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
    public getPaginatedResult<T>(url: string, params: HttpParams): Observable<PaginatedResult<T>> {
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