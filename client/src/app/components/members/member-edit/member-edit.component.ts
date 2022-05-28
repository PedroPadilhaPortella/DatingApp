import { MembersService } from './../../../services/members.service';
import { AccountService } from './../../../services/account.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { take } from 'rxjs/operators';
import { Toast, ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
    @ViewChild('editForm') editForm: NgForm;
    member: Member;
    user: User;

    @HostListener('window:beforeunload', ['$event']) unloadMember($event: any) {
        if(this.editForm.dirty) {
            $event.returnValue = true;
        }
    }

    constructor(
        private accountService: AccountService,
        private memberService: MembersService,
        private toastr: ToastrService,
    ) {
        this.loadUser();
    }

    ngOnInit(): void {
        this.loadMember();
    }

    loadUser() {
        this.accountService.currentUser$.pipe(take(1))
            .subscribe((user: User) => this.user = user)
    }

    loadMember() {
        this.memberService.getMember(this.user.username)
            .subscribe((member: Member) => this.member = member)
    }

    updateMember() {
        this.memberService.updateMember(this.member).subscribe(() => {
            this.toastr.success('Member updated successfully');
            this.editForm.reset(this.member);
        });
    }

}
