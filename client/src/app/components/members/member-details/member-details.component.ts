import { PresenceService } from './../../../services/presence.service';
import { MessagesService } from './../../../services/messages.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/models/member';
import { MembersService } from './../../../services/members.service';
import { Message } from 'src/app/models/message';

@Component({
    selector: 'app-member-details',
    templateUrl: './member-details.component.html',
    styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
    @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
    activeTab: TabDirective;

    member: Member;
    messages: Message[] = [];

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor(
        private route: ActivatedRoute,
        private messageService: MessagesService,
        public presenceService: PresenceService, 
    ) { }

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

    // loadMember() {
    //     const username = this.route.snapshot.paramMap.get('username');
    //     this.memberService.getMember(username).subscribe((member: Member) => {
    //         this.member = member;
    //         this.galleryImages = this.getImages();
    //     });
    // }

    loadMessages() {
        this.messageService.getMessagesThread(this.member.username)
            .subscribe((messages: Message[]) => {
                this.messages = messages;
            });
    }

    getImages() {
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

    setGalleryOptions() {
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

    onTabActivate(tab: TabDirective) {
        this.activeTab = tab;
        if(this.activeTab.heading == 'Messages' && this.messages.length === 0) {
            this.loadMessages();
        }
    }

    selectTab(tabId: number) {
        this.memberTabs.tabs[tabId].active = true;
    }
}
