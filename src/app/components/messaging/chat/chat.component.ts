import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { MessagingService } from '../../../services/messaging.service';
import { ChatMessage } from '../../../models/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <div class="user-info">
          <div class="avatar" [class.online]="isUserOnline">
            {{receiverId[0].toUpperCase()}}
          </div>
          <div class="user-details">
            <div class="username">{{receiverId}}</div>
            <div class="status">{{isUserOnline ? 'Online' : 'Offline'}}</div>
          </div>
        </div>
      </div>

      <div class="messages-container" #scrollContainer>
        <div class="message-list">
          <div *ngFor="let message of messages"
               class="message"
               [class.sent]="message.isCurrentUser"
               [class.received]="!message.isCurrentUser">
            <div class="message-content">
              <p>{{message.content}}</p>
              <span class="message-time">{{message.timestamp | date:'shortTime'}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-container">
        <mat-form-field appearance="outline" class="message-input">
          <input matInput
                 [(ngModel)]="newMessage"
                 placeholder="Type a message..."
                 (keyup.enter)="sendMessage()">
          <mat-icon matSuffix 
                    [class.active]="newMessage.trim()"
                    (click)="sendMessage()">send</mat-icon>
        </mat-form-field>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: white;
    }

    .chat-header {
      padding: 16px;
      border-bottom: 1px solid #eee;
      background: white;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e3f2fd;
      color: #1976d2;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 20px;
      position: relative;

      &.online::after {
        content: '';
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #4caf50;
        border: 2px solid white;
      }
    }

    .user-details {
      .username {
        font-weight: 500;
        font-size: 16px;
      }

      .status {
        font-size: 13px;
        color: #666;
      }
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background: #f8f9fa;
    }

    .message-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message {
      max-width: 70%;
      display: flex;

      &.sent {
        margin-left: auto;
        .message-content {
          background: #9c27b0;
          color: white;
          border-radius: 16px 16px 4px 16px;
          
          .message-time {
            color: rgba(255,255,255,0.7);
          }
        }
      }

      &.received {
        margin-right: auto;
        .message-content {
          background: white;
          border-radius: 16px 16px 16px 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      }
    }

    .message-content {
      padding: 12px 16px;
      
      p {
        margin: 0 0 4px 0;
        line-height: 1.4;
      }

      .message-time {
        font-size: 11px;
        opacity: 0.7;
      }
    }

    .chat-input-container {
      padding: 16px;
      background: white;
      border-top: 1px solid #eee;
    }

    .message-input {
      width: 100%;

      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      mat-icon {
        cursor: pointer;
        opacity: 0.5;
        transition: all 0.2s ease;

        &.active {
          opacity: 1;
          color: #9c27b0;
        }
      }
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  receiverId: string = '';
  messages: ChatMessage[] = [];
  newMessage: string = '';
  private subscription?: Subscription;
  isUserOnline: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private messagingService: MessagingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.receiverId = params['id'];
      this.loadMessages();
      this.isUserOnline = Math.random() < 0.5; // Simulate online status
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  private loadMessages() {
    this.subscription = this.messagingService
      .getMessagesBetweenUsers(this.receiverId)
      .subscribe(messages => {
        this.messages = messages.map(msg => ({
          ...msg,
          senderName: msg.senderId,
          isCurrentUser: msg.senderId !== this.receiverId
        }));
        setTimeout(() => this.scrollToBottom(), 100);
      });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messagingService
        .sendMessage(this.receiverId, this.newMessage.trim())
        .subscribe(() => {
          this.newMessage = '';
        });
    }
  }
}