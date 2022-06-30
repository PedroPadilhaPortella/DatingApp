import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { MessagesService } from './../../../services/messages.service';

@Component({
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
