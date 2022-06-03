import { AccountService } from 'src/app/services/account.service';
import { UserParams } from './../../../models/userParams';
import { Pagination } from './../../../models/pagination';
import { Observable, take } from 'rxjs';
import { MembersService } from './../../../services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-members-list',
    templateUrl: './members-list.component.html',
    styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
    members: Member[];
    pagination: Pagination;
    userParams: UserParams;
    user: User;
    genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];

    constructor(private memberService: MembersService, private accountService: AccountService) {
        this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
            this.user = user;
            this.userParams = new UserParams(user);
        })
    }

    ngOnInit(): void {
        this.loadMembers();
    }
    
    loadMembers() {
        this.memberService.getMembers(this.userParams)
            .subscribe((response) => {
                this.members = response.result;
                this.pagination = response.pagination;
                this.pagination.currentPage
            });
    }

    resetFilters() {
        this.userParams = new UserParams(this.user);
        this.loadMembers();
    }

    pageChanged(event: any): void {
        this.userParams.pageNumber = event.page;
        this.loadMembers();
    }
}
