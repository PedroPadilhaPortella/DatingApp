import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/models/member';
import { MembersService } from './../../../services/members.service';

@Component({
    selector: 'app-member-details',
    templateUrl: './member-details.component.html',
    styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
    member: Member;

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor(private memberService: MembersService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.loadMember();
        this.setGalleryOptions();
    }

    loadMember() {
        const username = this.route.snapshot.paramMap.get('username');
        this.memberService.getMember(username).subscribe((member: Member) => {
            this.member = member;
            this.galleryImages = this.getImages();
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
}
