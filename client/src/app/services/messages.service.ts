import { PaginationService } from './pagination.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Message } from '../models/message';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/pagination';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    baseUrl = environment.APIUrl;

    constructor(private http: HttpClient, private paginationService: PaginationService) { }

    getMessages(pageNumber: number, pageSize: number, container: string)
    : Observable<PaginatedResult<Message[]>> {
        let params = this.paginationService.buildPaginationHeader(pageNumber, pageSize);
        params = params.append('container', container);

        return this.paginationService
            .getPaginatedResult<Message[]>(`${this.baseUrl}/messages`, params);
    }

    getMessagesThread(username: string):Observable<Message[]> {
        return this.http.get<Message[]>(`${this.baseUrl}/messages/thread/${username}`);
    }

    sendMessage(username: string, content: string): Observable<Message> {
        return this.http.post<Message>(`${this.baseUrl}/messages`, {recipientUsername: username, content});
    }
    
    deleteMessage(id: number) {
        return this.http.delete(`${this.baseUrl}/messages/${id}`);
    }
}