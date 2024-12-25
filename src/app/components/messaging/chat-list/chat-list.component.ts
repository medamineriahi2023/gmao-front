import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessagingService } from '../../../services/messaging.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

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
           [routerLink]="['/messages', user.id]"
           routerLinkActive="active"
           class="user-item">
          <div class="user-avatar" [class.online]="user.isOnline">
            {{user.name[0].toUpperCase()}}
          </div>
          <div class="user-info">
            <div class="user-name">{{user.name}}</div>
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
  currentUserId: string | null = null;
  users$: Observable<any[]>;
  filteredUsers: any[] = [];
  searchTerm: string = '';

  constructor(
    private messagingService: MessagingService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.username || null;

    this.users$ = this.authService.getAllUsers().pipe(
      map(users => users.filter(user => user.username !== this.currentUserId)),
      map(users => users.map(user => ({
        id: user.username,
        name: `${user.firstName} ${user.lastName}`,
        unreadCount: 0
      })))
    );
  }

  ngOnInit() {
    this.users$.subscribe(users => {
      this.filteredUsers = users;
    });

    // Subscribe to route changes to update active user
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.users$.subscribe(users => {
          this.filteredUsers = users.map(user => ({
            ...user,
            active: user.id === params['id']
          }));
        });
      }
    });
  }

  filterUsers() {
    this.users$.subscribe(users => {
      this.filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }
}