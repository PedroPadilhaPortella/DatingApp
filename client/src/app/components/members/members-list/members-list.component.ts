import { Observable } from 'rxjs';
import { MembersService } from './../../../services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';

@Component({
    selector: 'app-members-list',
    templateUrl: './members-list.component.html',
    styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
    members$: Observable<Member[]>;

    constructor(private memberService: MembersService) { }

    ngOnInit(): void {
        this.loadMembers();
    }
    
    loadMembers() {
        this.members$ = this.memberService.getMembers();
    }
}
