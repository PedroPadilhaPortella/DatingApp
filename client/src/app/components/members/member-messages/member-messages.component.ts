import { MembersService } from './../../../services/members.service';
import { MessagesService } from './../../../services/messages.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/message';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
    @ViewChild('messageForm') messageForm: NgForm;
    @Input('messages') messages: Message[] = [];
    @Input('username') username: string = '';
    messageContent: string;

    constructor(public messagesService: MessagesService) { }

    ngOnInit(): void { }

    /**
     * Send the messages to the receiper
     */
    sendMessage() {
        this.messagesService.sendMessage(this.username, this.messageContent)
            .then(() => {
                this.messageForm.reset();
            })
    }
}
