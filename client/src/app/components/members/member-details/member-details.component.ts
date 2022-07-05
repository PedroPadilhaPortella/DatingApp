import { ToastrMessageService } from 'src/app/services/toastr-message.service';
import { ToastrService } from 'ngx-toastr';
import { PresenceService } from './../../../services/presence.service';
import { MessagesService } from './../../../services/messages.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/models/member';
import { MembersService } from './../../../services/members.service';
import { Message } from 'src/app/models/message';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models/user';
import { take } from 'rxjs';

@Component({
    selector: 'app-member-details',
    templateUrl: './member-details.component.html',
    styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
    activeTab: TabDirective;

    member: Member;
    user: User;
    messages: Message[] = [];

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private memberService: MembersService,
        private messageService: MessagesService,
        private toastrService: ToastrMessageService,
        public presenceService: PresenceService,
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.accountService.currentUser$.pipe(take(1))
            .subscribe((user) => this.user = user)
    }
    
    /**
     * Get the member with the id of the route. 
     * Then set the member to the member property.
     * Then set the galleryOptions to the galleryOptions property. 
     * Then set the galleryImages to the member's photos. 
     * Then set the activeTab to be shown when the page render.
     */
    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.member = data.member;
        });
        this.setGalleryOptions();
        this.galleryImages = this.getImages();
        this.route.queryParams.subscribe(params => {
            params.tab ? this.selectTab(params.tab) : this.selectTab(0);
        })
    }

    loadMessages(): void {
        this.messageService.getMessagesThread(this.member.username)
            .subscribe((messages: Message[]) => {
                this.messages = messages;
            });
    }

    getImages(): any[] {
        const imageUrls = []
        for (const photo of this.member.photos) {
            imageUrls.push({
                small: photo?.url,
                medium: photo?.url,
                big: photo?.url,
            });
        }
        return imageUrls;
    }

    setGalleryOptions(): void {
        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                imagePercent: 100,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false,
            },
        ];
    }

    onTabActivate(tab: TabDirective): void {
        this.activeTab = tab;
        if (this.activeTab.heading == 'Messages' && this.messages.length === 0) {
            this.messageService.createHubConnection(this.user, this.member.username);
        } else {
            this.messageService.stopHubConnection();
        }
    }

    addLike(member: Member) {
        this.memberService.addLike(member.username).subscribe(() => {
            this.toastrService.showSuccessToastr(`You have liked ${member.knownAs}`, "Success");
        });
    }

    selectTab(tabId: number): void {
        this.memberTabs.tabs[tabId].active = true;
    }

    ngOnDestroy(): void {
        this.messageService.stopHubConnection();
    }
}
