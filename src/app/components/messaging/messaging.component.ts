import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatListComponent } from './chat-list/chat-list.component';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatListComponent],
  template: `
    <div class="messaging-container">
      <div class="sidebar">
        <app-chat-list></app-chat-list>
      </div>
      <div class="chat-area">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .messaging-container {
      display: grid;
      grid-template-columns: 350px 1fr;
      height: calc(100vh - 64px);
      background: white;
    }

    .sidebar {
      border-right: 1px solid #eee;
      background: white;
      overflow: hidden;
    }

    .chat-area {
      background: white;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .messaging-container {
        grid-template-columns: 1fr;
      }

      .sidebar {
        display: none;
      }
    }
  `]
})
export class MessagingComponent {}