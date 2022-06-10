import { MembersService } from './../services/members.service';
import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Member } from '../models/member';

@Injectable({
    providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {

    constructor(private memberService: MembersService) {}

    /**
     * Resolve a route to get a member.
     * @param route The route of the current page.
     * @returns `Observable<Member>` The member with the id of the route.
     */
    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        return this.memberService.getMember(route.params.username);
    }
}
