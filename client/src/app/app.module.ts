import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { TestErrorsComponent } from './components/errors/test-errors/test-errors.component';
import { HomeComponent } from './components/home/home.component';
import { ListsComponent } from './components/lists/lists.component';
import { MemberDetailsComponent } from './components/members/member-details/member-details.component';
import { MembersListComponent } from './components/members/members-list/members-list.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NavComponent } from './components/nav/nav.component';
import { RegisterComponent } from './components/register/register.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { SharedModule } from './shared/shared.module';
import { ServerErrorComponent } from './components/errors/server-error/server-error.component';
import { MemberCardComponent } from './components/members/member-card/member-card.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { PhotoEditorComponent } from './components/members/photo-editor/photo-editor.component';
import { TextInputComponent } from './components/shared/text-input/text-input.component';
import { DateInputComponent } from './components/shared/date-input/date-input.component';
import { MemberMessagesComponent } from './components/members/member-messages/member-messages.component';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        RegisterComponent,
        MembersListComponent,
        MemberDetailsComponent,
        ListsComponent,
        MessagesComponent,
        NotFoundComponent,
        TestErrorsComponent,
        ServerErrorComponent,
        MemberCardComponent,
        MemberEditComponent,
        PhotoEditorComponent,
        TextInputComponent,
        DateInputComponent,
        MemberMessagesComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule,
        TabsModule.forRoot(),
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
