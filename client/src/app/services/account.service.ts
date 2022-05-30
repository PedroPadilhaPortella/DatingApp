import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserLogin } from '../models/user';

// Angular Services are Singletons, they are shared across the application.
// Injectable decorator is used to mark a class as available for dependency injection.

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    baseUrl = 'https://localhost:5001/api';
    private currentUserSource = new ReplaySubject<User>(1);
    currentUser$ = this.currentUserSource.asObservable();

    constructor(private http: HttpClient) { }

    /**
     * Login the user.
     * @param model 
     * @returns 
     */
    login(model: any) {
        return this.http.post(`${this.baseUrl}/account/login`, model).pipe(
            map((user: User) => {
                if (user) {
                    this.setCurrentUser(user);
                }
            })
        );
    }

    /**
     * Register the user.
     */
    register(model: UserLogin) {
        return this.http.post(`${this.baseUrl}/account/register`, model).pipe(
            map((user: User) => {
                this.setCurrentUser(user);
            })
        )
    }

    /**
     * Set the current user on the Buffer of ReplaySubject and save him on the localStorage.
     * @param user 
     */
    setCurrentUser(user: User) {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
        }
    }

    /**
     * Logout the user, removing him from the localStorage and cleaning the Buffer of ReplaySubject.
     */
    logout() {
        localStorage.removeItem('user');
        this.currentUserSource.next(null);
    }
}
