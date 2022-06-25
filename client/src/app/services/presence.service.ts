import { User } from './../models/user';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PresenceService {

    hubUrl = environment.HubUrl;
    private hubConnection: HubConnection;

    private onlineUsersSource = new BehaviorSubject<string[]>([]);
    onlineUsers$ = this.onlineUsersSource.asObservable();

    constructor(private toastr: ToastrService, private router: Router) { }

    /**
     * Creating of the hubConnection
     * @param user the `User` that is being logged in
     */
    createHubConnection(user: User) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${this.hubUrl}/presence`, {
                accessTokenFactory: () => user.token,
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch(error => console.log(error));

        this.hubConnection.on('UserIsOnline', username => {
            this.onlineUsers$.pipe(take(1))
                .subscribe(usernames => {
                    this.onlineUsersSource.next([...usernames, username])
                })
        });



        this.hubConnection.on('UserIsOffline', username => {
            this.onlineUsers$.pipe(take(1))
                .subscribe(usernames => {
                    this.onlineUsersSource.next([...usernames.filter(x => x != username)])
                })
        });

        this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
            this.onlineUsersSource.next(usernames);
        });

        this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
            this.toastr.info(`${knownAs} has sent you a new message!`)
                .onTap.pipe(take(1))
                .subscribe(() => this.router.navigateByUrl(`/member/${username}?tab=3`));
        });
    }

    /**
     * Stopping the hubConnection
     */
    stopHubConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop().catch(error => console.log(error));
        }
    }
}
