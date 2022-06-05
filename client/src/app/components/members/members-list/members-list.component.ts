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
    userParams: UserParams;
    user: User;
    genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
    pagination: Pagination = {totalItems: 0, currentPage: 0, itemsPerPage: 0, totalPages: 0};

    constructor(private memberService: MembersService) {
        this.userParams = this.memberService.getUserParams();
    }

    ngOnInit(): void {
        this.loadMembers();
    }
    
    loadMembers() {
        this.memberService.setUserParams(this.userParams);
        this.memberService.getMembers(this.userParams)
            .subscribe((response) => {
                this.members = response.result;
                this.pagination = response.pagination;
                this.pagination.currentPage
            });
    }

    resetFilters() {
        this.userParams = this.memberService.resetUserParams();
        this.loadMembers();
    }
    
    pageChanged(event: any): void {
        this.userParams.pageNumber = event.page;
        this.memberService.setUserParams(this.userParams);
        this.loadMembers();
    }
}
