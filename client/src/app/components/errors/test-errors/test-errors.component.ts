import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-test-errors',
    templateUrl: './test-errors.component.html',
    styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {
    baseurl = environment.APIUrl;
    validationErrors: string[] = [];

    constructor(private http: HttpClient) { }

    ngOnInit(): void {}

    get404Error(): void {
        this.http.get(`${this.baseurl}buggy/not-found`)
            .subscribe({
                next: (data) => {
                    console.log(data);
                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    get400Error(): void {
        this.http.get(`${this.baseurl}buggy/bad-request`)
            .subscribe({
                next: (data) => {
                    console.log(data);
                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    get500Error(): void {
        this.http.get(`${this.baseurl}buggy/server-error`)
            .subscribe({
                next: (data) => {
                    console.log(data);
                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    get401Error(): void {
        this.http.get(`${this.baseurl}buggy/auth`)
            .subscribe({
                next: (data) => {
                    console.log(data);
                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    get400ValidationError(): void {
        this.http.post(`${this.baseurl}account/register`, {})
            .subscribe({
                next: (data) => {
                    console.log(data);
                },
                error: (err) => {
                    console.log(err);
                    this.validationErrors = err;
                }
            }
        );
    }
}