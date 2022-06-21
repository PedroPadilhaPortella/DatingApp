import { PresenceService } from './../../../services/presence.service';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrMessageService } from 'src/app/services/toastr-message.service';
import { Member } from './../../../models/member';
import { MembersService } from './../../../services/members.service';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
    @Input('member') member: Member;
    @Input('liked') liked: boolean = false;
    
    constructor(
        private memberService: MembersService, 
        private toastrService: ToastrMessageService,
        public presenceService: PresenceService,
    ) { }

    ngOnInit(): void {}

    addLike(member: Member) {
        this.memberService.addLike(member.username).subscribe(() => {
            this.toastrService.showSuccessToastr(`You have liked ${member.knownAs}`, "Success");
        });
    }

}
