import { User } from './../models/user';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PresenceService {

    hubUrl = environment.HubUrl;
    private hubConnection: HubConnection;
    private onlineUsersSource = new BehaviorSubject<string[]>([]);
    onlineUsers$ = this.onlineUsersSource.asObservable();


    constructor(private toastr: ToastrService) { }

    /**
     * Creating of the hubConnection
     * @param user the `User` that is being logged in
     */
    createHubConnection(user: User) {
        this.hubConnection = new HubConnectionBuilder()
            // .configureLogging(signalR.LogLevel.Debug)   
            .withUrl(`${this.hubUrl}/presence`, { 
                accessTokenFactory: () => user.token, 
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start()
            .catch(error => console.log(error));

        this.hubConnection.on('UserIsOnline', (username: string) => {
            this.toastr.info(username + ' has connected');
        });

        this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
            this.onlineUsersSource.next(usernames);
        });

        this.hubConnection.on('UserIsOffline', (username: string) => {
            this.toastr.warning(username + ' has disconnected');
        });
    }

    /**
     * Stopping the hubConnection
     */
    stopHubConnection() {
        this.hubConnection.stop()
            .catch(error => console.log(error));
    }
}
