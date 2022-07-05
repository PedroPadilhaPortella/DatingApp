import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { Group } from '../models/group';
import { Message } from '../models/message';
import { PaginatedResult } from '../models/pagination';
import { User } from '../models/user';
import { BusyService } from './busy.service';
import { PaginationService } from './pagination.service';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    baseUrl = environment.APIUrl;
    hubUrl = environment.HubUrl;
    private hubConnection: HubConnection;

    private messageThreadSource = new BehaviorSubject<Message[]>([]);
    messageThread$ = this.messageThreadSource.asObservable();

    constructor(
        private http: HttpClient, 
        private paginationService: PaginationService,
        private busyService: BusyService,
        private toastr: ToastrService,
    ) { }

    getMessages(pageNumber: number, pageSize: number, container: string)
        : Observable<PaginatedResult<Message[]>> {
        let params = this.paginationService.buildPaginationHeader(pageNumber, pageSize);
        params = params.append('container', container);

        return this.paginationService
            .getPaginatedResult<Message[]>(`${this.baseUrl}/messages`, params);
    }

    getMessagesThread(username: string): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.baseUrl}/messages/thread/${username}`);
    }

    async sendMessage(username: string, content: string): Promise<any> {
        return this.hubConnection.invoke('SendMessage', { recipientUsername: username, content })
            .catch(error => console.log(error));
        // return this.http.post<Message>(`${this.baseUrl}/messages`, { recipientUsername: username, content });
    }

    deleteMessage(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/messages/${id}`);
    }

    /**
     * Creating of the hubConnection
     * @param user the `User` that is being logged in, the sender
     * @param otherUsername `string` the username of the receiper
     */
    createHubConnection(user: User, otherUsername: string): void {
        this.busyService.busy();
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${this.hubUrl}/message?user=${otherUsername}`, {
                accessTokenFactory: () => user.token,
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start()
            .catch(error => console.log(error))
            .finally(() =>  this.busyService.idle());

        this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
            this.messageThreadSource.next(messages);
        });

        this.hubConnection.on('NewMessage', (message: Message) => {
            this.messageThread$.pipe(take(1)).subscribe(messages => {
                this.messageThreadSource.next([...messages, message]);
            })
        });

        this.hubConnection.on('UpdatedGroup', (group: Group) => {
            if(group.connections.some(x => x.username == otherUsername)) {
                this.messageThread$.pipe(take(1)).subscribe((messages) => {
                    messages.forEach(message => {
                        if(!message.dateRead) {
                            message.dateRead = new Date(Date.now());
                        }
                    });
                    this.messageThreadSource.next([...messages]);
                })
            }
        })
    }

    /**
     * Stopping the hubConnection
     */
    stopHubConnection(): void {
        if(this.hubConnection) {
            this.messageThreadSource.next([]);
            this.hubConnection.stop().catch(error => console.log(error));
        }
    }
}