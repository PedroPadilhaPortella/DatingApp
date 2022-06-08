import { MembersService } from './../../services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { PaginatedResult, Pagination } from '../../models/pagination';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
    pagination: Pagination = {totalItems: 0, currentPage: 0, itemsPerPage: 0, totalPages: 0};
    members: Partial<Member[]>;
    predicate = 'liked';
    pageNumber = 1;
    pageSize = 6;

    constructor(private memberService: MembersService) { }

    ngOnInit(): void {
        this.loadLikes();
    }

    loadLikes() {
        this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize)
        .subscribe((response: PaginatedResult<Member[]>) => {
            this.members = response.result;
            this.pagination = response.pagination;
        });
    }

    pageChanged(event: any): void {
        this.pageNumber = event.page;
        this.loadLikes();
    }
}
