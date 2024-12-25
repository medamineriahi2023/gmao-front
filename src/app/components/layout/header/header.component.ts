import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MessagingService } from '../../../services/messaging.service';
import { NotificationService } from '../../../services/notification.service';
import { NotificationPanelComponent } from './notifications/notification-panel.component';
import { MessagePanelComponent } from './messages/message-panel.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    NotificationPanelComponent,
    MessagePanelComponent
  ],
  template: `
    <mat-toolbar class="header">
      <div class="header-start">
        <img style="width: 90px" src="../../../../assets/images/logo/logo-oga.png" alt="Logo">
        <button mat-icon-button (click)="menuToggled.emit()">
          <mat-icon>menu</mat-icon>
        </button>
      </div>

      <div class="header-end">
        <app-notification-panel
          [unreadCount]="unreadNotificationsCount"
          [notifications]="notifications">
        </app-notification-panel>
        
        <app-message-panel
          [unreadCount]="unreadMessagesCount"
          [messages]="messages">
        </app-message-panel>

        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-btn">
          <div class="user-avatar-small">JD</div>
        </button>
      </div>

      <mat-menu #userMenu="matMenu">
        <div class="menu-container">
          <div class="user-header">
            <div class="user-avatar">JD</div>
            <div class="user-info">
              <div class="user-name">Jean Dupont</div>
              <div class="user-email">jean.dupontdomain.com</div>
            </div>
          </div>

          <div class="menu-content">
            <button mat-menu-item>
              <mat-icon>person</mat-icon>
              <span>Mon profil</span>
            </button>
            <button mat-menu-item>
              <mat-icon>settings</mat-icon>
              <span>Paramètres</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()" class="logout-item">
              <mat-icon>logout</mat-icon>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 64px;
      padding: 0 16px;
      background: white;
      color: rgba(0, 0, 0, 0.87);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .header-start, .header-end {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar-small {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e3f2fd;
      color: #1976d2;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 14px;
    }

    .user-header {
      padding: 16px;
      display: flex;
      gap: 12px;
      align-items: center;
      background: #f8f9fa;
      border-bottom: 1px solid #eee;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e3f2fd;
      color: #1976d2;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }

    .user-info {
      .user-name {
        font-weight: 500;
        color: #2c3e50;
      }

      .user-email {
        font-size: 12px;
        color: #95a5a6;
      }
    }

    .logout-item {
      color: #e74c3c;
    }
  `]
})
export class HeaderComponent implements OnInit {
  @Output() menuToggled = new EventEmitter<void>();
  unreadMessagesCount = 0;
  unreadNotificationsCount = 0;
  
  messages = [
    {
      sender: 'John Smith',
      subject: 'Maintenance requise - Chargeuse #1',
      preview: 'Hey, we need to schedule maintenance for loader #1 as soon as possible...',
      time: new Date(),
      isOnline: true,
      unread: true
    },
    {
      sender: 'Alice Johnson',
      subject: 'Contrat proche de l\'expiration',
      preview: 'The contract for the equipment lease is expiring next month...',
      time: new Date(),
      isOnline: false,
      unread: false
    }
  ];

  notifications = [
    {
      message: 'Nouvelle demande d\'achat #3',
      severity: 'warn',
      time: new Date(),
      unread: true
    },
    {
      message: 'Bon de travail #2 mis à jour',
      severity: 'info',
      time: new Date(),
      unread: false
    }
  ];

  constructor(
    private messagingService: MessagingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.messagingService.getUnreadCount().subscribe(count => {
      this.unreadMessagesCount = count;
    });
    this.notificationService.getUnreadNotificationsCount().subscribe(count => {
      this.unreadNotificationsCount = count;
    });
  }

  logout() {
    // TODO: Implement logout functionality
  }
}
