import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { Message } from '../../../types/message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe,TimeAgoPipe,FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit {
  @ViewChild('messagesEndRef') private messagesEndRef!: ElementRef;
  protected messageService = inject(MessageService);
  private memberService = inject(MemberService);
  protected presenceService = inject(PresenceService);
  private route = inject(ActivatedRoute);
  protected messageContent = '';
  
  constructor() {
    effect(() => {
      const currentMessages = this.messageService.messageThread();
      if(currentMessages.length > 0) {
        this.scrollToBottom();
      }});
  }


  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: params =>{
        const otherUserId = params.get('id');
        if(!otherUserId) throw new Error('Cannot connect to hub');

        this.messageService.createHubConnection(otherUserId);
        
      }
    });
  }



  async sendMessage() {
    const recipientId = this.memberService.member()?.id;
    const content = this.messageContent.trim();

    if(!recipientId || !content) return;

    this.messageContent = '';

    try {
      await this.messageService.sendMessage(recipientId, content);
    } catch {
      this.messageContent = content;
    }
  }

  scrollToBottom(): void {

    setTimeout(() =>{
      if(this.messagesEndRef) {
      this.messagesEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
     }   
    })
  }
}
