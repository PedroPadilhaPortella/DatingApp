import { ConfirmService } from './../../services/confirm.service';
import { MessagesService } from './../../services/messages.service';
import { Message } from './../../models/message';
import { Component, OnInit } from '@angular/core';
import { PaginatedResult, Pagination } from '../../models/pagination';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    messages: Message[] = [];
    pagination: Pagination;
    container = 'Unread';
    pageNumber = 1;
    pageSize = 6;
    loading = false;

    constructor(private messageService: MessagesService, private confirmService: ConfirmService) { }

    ngOnInit(): void {
        this.loadMessages();
    }

    loadMessages() {
        this.loading = true;
        this.messageService.getMessages(this.pageNumber, this.pageSize, this.container)
            .subscribe((response: PaginatedResult<Message[]>) => {
                this.messages = response.result;
                this.pagination = response.pagination;
                this.loading = false;
            });
    }

    deleteMessage(id: number) {
        this.confirmService.confirm('Confirm delete message', 'Thsi cannot be undone')
            .subscribe((result) => {
                if (result) {
                    this.messageService.deleteMessage(id).subscribe(() => {
                        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
                    });
                }
            });
    }

    pageChanged(event: any): void {
        if (this.pageNumber !== event.page) {
            this.pageNumber = event.page;
            this.loadMessages();
        }
    }

}
