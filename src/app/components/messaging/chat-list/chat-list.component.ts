import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../../services/auth.service';
import { MessagingService } from '../../../services/messaging.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatListModule, 
    MatIconModule, 
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="chat-list">
      <div class="search-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search users</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="filterUsers()">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="users-list">
        <a *ngFor="let user of filteredUsers" 
           [routerLink]="['/messages', user.username]"
           routerLinkActive="active"
           class="user-item">
          <div class="user-avatar" [class.online]="user.isOnline">
            {{user.username[0].toUpperCase()}}
          </div>
          <div class="user-info">
            <div class="user-name">{{user.username}}</div>
            <div class="user-role">{{user.role | titlecase}}</div>
          </div>
          <div class="user-status" *ngIf="user.unreadCount">
            <span class="unread-badge">{{user.unreadCount}}</span>
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .chat-list {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: white;
    }

    .search-container {
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .search-field {
      width: 100%;
    }

    .users-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .user-item {
      display: flex;
      align-items: center;
      padding: 12px;
      margin: 4px 0;
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover {
        background: #f5f5f5;
      }

      &.active {
        background: #f0e6ff;
      }
    }

    .user-avatar {
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
      margin-right: 16px;
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

    .user-info {
      flex: 1;
    }

    .user-name {
      font-weight: 500;
      font-size: 16px;
      margin-bottom: 4px;
    }

    .user-role {
      font-size: 13px;
      color: #666;
    }

    .unread-badge {
      background: #9c27b0;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
  `]
})
export class ChatListComponent implements OnInit {
  users: (User & { isOnline: boolean, unreadCount: number })[] = [];
  filteredUsers: (User & { isOnline: boolean, unreadCount: number })[] = [];
  searchTerm: string = '';
  currentUserId: string | null = null;

  constructor(
    private authService: AuthService,
    private messagingService: MessagingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.username || null;

    // Get all users except current user
    this.users = this.authService.getAllUsers()
      .filter(user => user.username !== this.currentUserId)
      .map(user => ({
        ...user,
        isOnline: Math.random() < 0.5, // Simulate online status
        unreadCount: Math.floor(Math.random() * 5) // Simulate unread messages
      }));

    this.filteredUsers = [...this.users];

    // Subscribe to route changes to update active user
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.users = this.users.map(user => ({
          ...user,
          active: user.username === params['id']
        }));
      }
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}