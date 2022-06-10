import { MemberDetailedResolver } from './resolvers/member-detailed.resolver';
import { PreventUnsaveChangesGuard } from './guards/prevent-unsave-changes.guard';
import { ServerErrorComponent } from './components/errors/server-error/server-error.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { TestErrorsComponent } from './components/errors/test-errors/test-errors.component';
import { HomeComponent } from './components/home/home.component';
import { ListsComponent } from './components/lists/lists.component';
import { MemberDetailsComponent } from './components/members/member-details/member-details.component';
import { MembersListComponent } from './components/members/members-list/members-list.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AuthGuard } from './guards/auth.guard';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, },
    { path: 'not-found', component: NotFoundComponent },
    { path: 'server-error', component: ServerErrorComponent },
    { path: 'error', component: TestErrorsComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MembersListComponent },
            { path: 'member/edit', component: MemberEditComponent, 
                canDeactivate: [PreventUnsaveChangesGuard] },
            { path: 'member/:username', component: MemberDetailsComponent, 
                resolve: {member: MemberDetailedResolver} },
            { path: 'lists', component: ListsComponent },
            { path: 'messages', component: MessagesComponent },
        ]
    },
    { path: '**', redirectTo: 'home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
