import { Component, inject, OnInit, signal } from '@angular/core';
import { Messages } from "../../messages/messages";
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { Message } from '../../../types/message';

@Component({
  selector: 'app-member-messages',
  imports: [Messages],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit {
  private messageService = inject(MessageService);
  private memberService = inject(MemberService);

  protected messages = signal<Message[]>([]);
  
  ngOnInit(): void {
    this.loadMessages();
  }

  private loadMessages() {
    const member = this.memberService.member()?.id;
    if(member){
      this.messageService.getMessageThread(member).subscribe({
        next: messages => this.messages.set(messages)
      });
    }

   
  }
}
