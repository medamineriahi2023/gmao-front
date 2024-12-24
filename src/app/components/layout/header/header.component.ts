import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MessagingService } from '../../../services/messaging.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatBadgeModule,
        MatMenuModule,
        MatDividerModule
    ],
    template: `
        <mat-toolbar class="header">
            <div class="header-start">
                <button mat-icon-button (click)="menuToggled.emit()">
                    <mat-icon>menu</mat-icon>
                </button>
                <svg
                        width="96"
                        height="32"
                        viewBox="0 0 96 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0)">
                        <path
                                d="M51.592 10.368H44.872V14.352H51.4V17.52H44.872V24H41.56V7.2H51.592V10.368ZM60.9693 24.336C60.0733 24.336 59.2253 24.2 58.4253 23.928C57.6413 23.656 56.9613 23.272 56.3853 22.776C55.8093 22.264 55.3613 21.648 55.0413 20.928C54.7213 20.192 54.5613 19.384 54.5613 18.504V7.2H57.8493V18.24C57.8493 19.104 58.0973 19.8 58.5933 20.328C59.1053 20.84 59.8973 21.096 60.9693 21.096C62.0413 21.096 62.8253 20.84 63.3213 20.328C63.8333 19.8 64.0893 19.104 64.0893 18.24V7.2H67.4013V18.504C67.4013 19.384 67.2413 20.192 66.9213 20.928C66.6013 21.648 66.1533 22.264 65.5773 22.776C65.0013 23.272 64.3133 23.656 63.5133 23.928C62.7293 24.2 61.8813 24.336 60.9693 24.336ZM76.821 24.336C75.157 24.336 73.757 23.968 72.621 23.232C71.485 22.48 70.685 21.464 70.221 20.184L73.053 18.528C73.357 19.328 73.829 19.96 74.469 20.424C75.109 20.872 75.925 21.096 76.917 21.096C77.829 21.096 78.501 20.928 78.933 20.592C79.381 20.256 79.605 19.832 79.605 19.32C79.605 18.872 79.413 18.472 79.029 18.12C78.645 17.768 77.629 17.352 75.981 16.872C74.829 16.536 73.901 16.168 73.197 15.768C72.493 15.368 71.933 14.848 71.517 14.208C71.117 13.568 70.917 12.784 70.917 11.856C70.917 11.296 71.013 10.728 71.205 10.152C71.413 9.56 71.781 8.992 72.309 8.448C72.837 7.904 73.477 7.504 74.229 7.248C74.981 6.992 75.717 6.864 76.437 6.864C77.797 6.864 78.989 7.2 80.013 7.872C81.053 8.528 81.861 9.448 82.437 10.632L79.653 12.24C78.981 10.8 77.909 10.08 76.437 10.08C75.765 10.08 75.229 10.24 74.829 10.56C74.429 10.88 74.229 11.28 74.229 11.76C74.229 12.272 74.437 12.696 74.853 13.032C75.285 13.368 76.141 13.728 77.421 14.112C78.989 14.608 80.125 15.072 80.829 15.504C81.549 15.936 82.077 16.472 82.413 17.112C82.749 17.752 82.917 18.472 82.917 19.272C82.917 20.04 82.765 20.744 82.461 21.384C82.173 22.008 81.757 22.544 81.213 22.992C80.669 23.424 80.021 23.76 79.269 24C78.517 24.224 77.701 24.336 76.821 24.336ZM88.972 20.832H96.052V24H85.66V7.2H95.932V10.368H88.972V13.944H95.332V17.064H88.972V20.832Z"
                                fill="#3F414B"/>
                        <path
                                d="M16 6.75556V0L1.02839 14.6389C0.462304 15.1924 0.457197 16.1016 1.01703 16.6615L3.55556 19.2"
                                fill="#2196F3"/>
                        <path
                                d="M16 6.75556V0L30.9716 14.6389C31.5377 15.1924 31.5428 16.1016 30.983 16.6615L28.4444 19.2"
                                fill="#1878C6"/>
                        <path
                                d="M3.55556 19.2L9.6 13.1556H16V19.2"
                                fill="#1565C0"/>
                        <path
                                d="M28.4444 19.2L22.4 13.1556H16V19.2"
                                fill="#10519D"/>
                        <path
                                d="M16 25.9556H9.95555L12.9778 22.7556L16 25.9556Z"
                                fill="#1565C0"/>
                        <path
                                d="M16 32L22.0444 25.9556L16 25.9556V32Z"
                                fill="#1878C6"/>
                        <path
                                d="M16 32L9.95555 25.9556H16V32Z"
                                fill="#2196F3"/>
                        <path
                                d="M16 25.9556H22.0444L19.0222 22.7556L16 25.9556Z"
                                fill="#10519D"/>
                        <path
                                d="M7.72363 21.7502C7.18605 22.3085 7.19441 23.1944 7.74243 23.7424L9.95556 25.9556L16 19.5556V13.1556"
                                fill="#2196F3"/>
                        <path
                                d="M24.2764 21.7502C24.814 22.3085 24.8056 23.1944 24.2576 23.7424L22.0444 25.9556L16 19.5556V13.1556"
                                fill="#1878C6"/>
                    </g>
                    <defs>
                        <clipPath id="clip0">
                            <rect
                                    width="96"
                                    height="32"
                                    fill="white"/>
                        </clipPath>
                    </defs>
                </svg>

            </div>

            <div class="header-end">
                <button mat-icon-button [matMenuTriggerFor]="notificationsMenu"
                        [matBadge]="unreadNotificationsCount"
                        [matBadgeHidden]="unreadNotificationsCount === 0"
                        matBadgeSize="small"
                        class="notification-btn closer-badge"
                        matBadgeColor="warn">
                    <mat-icon>notifications</mat-icon>
                </button>
                <button mat-icon-button [matMenuTriggerFor]="messagesMenu"
                        [matBadge]="unreadMessagesCount"
                        [matBadgeHidden]="unreadMessagesCount === 0"
                        matBadgeSize="small"
                        class="message-btn closer-badge"
                        matBadgeColor="accent">
                    <mat-icon>mail</mat-icon>
                </button>
                <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-btn">
                    <div class="user-avatar-small">JD</div>
                </button>
            </div>

            <!-- Notifications Menu -->
            <mat-menu  #notificationsMenu="matMenu">
                <div class="menu-container">
                    <div class="menu-header">
                        <div class="header-content">
                            <mat-icon class="header-icon">notifications</mat-icon>
                            <div class="header-text">
                                <h3>Notifications</h3>
                                <span class="subtitle">{{unreadNotificationsCount}} new notifications</span>
                            </div>
                        </div>
                        <button mat-button class="view-all-btn">View All</button>
                    </div>

                    <div class="menu-content">
                        <div *ngFor="let notification of notifications"
                             class="notification-item"
                             [class.unread]="notification.unread">
                            <div class="notification-icon" [ngClass]="notification.severity">
                                <mat-icon>{{getNotificationIcon(notification.severity)}}</mat-icon>
                            </div>
                            <div class="notification-details">
                                <div class="notification-message">{{notification.message}}</div>
                                <div class="notification-time">{{notification.time | date:'shortTime'}}</div>
                                <div class="notification-actions">
                                    <button mat-button color="primary">View</button>
                                    <button mat-icon-button class="more-btn">
                                        <mat-icon>more_vert</mat-icon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="menu-footer">
                        <button mat-button color="primary" class="mark-read-btn">
                            <mat-icon>done_all</mat-icon>
                            Mark All as Read
                        </button>
                        <button mat-button color="warn" class="clear-btn">
                            <mat-icon>delete_outline</mat-icon>
                            Clear All
                        </button>
                    </div>
                </div>
            </mat-menu>

            <!-- Messages Menu -->
            <mat-menu #messagesMenu="matMenu" class="modern-menu messages-menu">
                <div class="menu-container">
                    <div class="menu-header">
                        <div class="header-content">
                            <mat-icon class="header-icon">mail</mat-icon>
                            <div class="header-text">
                                <h3>Messages</h3>
                                <span class="subtitle">{{unreadMessagesCount}} unread messages</span>
                            </div>
                        </div>
                        <button mat-button class="view-all-btn">View All</button>
                    </div>

                    <div class="menu-content">
                        <div *ngFor="let message of messages"
                             class="message-item"
                             [class.unread]="message.unread">
                            <div class="message-avatar">
                                <div class="avatar-circle" [class.online]="message.isOnline">
                                    {{message.sender?.charAt(0) || 'U'}}
                                </div>
                            </div>
                            <div class="message-details">
                                <div class="message-header">
                                    <span class="sender-name">{{message.sender}}</span>
                                    <span class="message-time">{{message.time | date:'shortTime'}}</span>
                                </div>
                                <div class="message-subject">{{message.subject}}</div>
                                <div class="message-preview">{{message.preview}}</div>
                                <div class="message-actions">
                                    <button mat-button color="primary" class="reply-btn">
                                        <mat-icon>reply</mat-icon>
                                        Reply
                                    </button>
                                    <button mat-button color="accent" class="read-btn">
                                        <mat-icon>visibility</mat-icon>
                                        Read
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="menu-footer">
                        <button mat-button color="primary" class="new-message-btn">
                            <mat-icon>edit</mat-icon>
                            New Message
                        </button>
                        <button mat-button class="archive-btn">
                            <mat-icon>archive</mat-icon>
                            Archive All
                        </button>
                    </div>
                </div>
            </mat-menu>

            <!-- User Menu -->
            <mat-menu #userMenu="matMenu" class="modern-menu user-menu">
                <div class="menu-container">
                    <div class="user-header">
                        <div class="user-avatar">JD</div>
                        <div class="user-info">
                            <div class="user-name">Jean Dupont</div>
                            <div class="user-email">jean.dupontexample.com</div>
                        </div>
                    </div>

                    <div class="menu-content">
                        <button mat-menu-item class="menu-item">
                            <mat-icon>person</mat-icon>
                            <span>Mon profil</span>
                        </button>
                        <button mat-menu-item class="menu-item">
                            <mat-icon>settings</mat-icon>
                            <span>Paramètres</span>
                        </button>
                        <mat-divider></mat-divider>
                        <button mat-menu-item (click)="logout()" class="menu-item logout-item">
                            <mat-icon>logout</mat-icon>
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </mat-menu>
        </mat-toolbar>
    `,
    styles: [`
        /* Header Styles */
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

        /* Menu Container Styles */
        .menu-container {
            width: auto;
            max-width: 1200px; /* Optional: Limits maximum width for very wide screens */
            padding: 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }

        .menu-container {
            width: auto; /* Larger width than before */
            max-width: none; /* No max-width constraint */
            padding: 0;
            background: white;
            border-radius: 8px;
            overflow-x: hidden; /* Hide horizontal scroll */
            overflow-y: auto; /* Allow vertical scroll if needed */
        }

        .menu-content {
            width: 100%; /* Fits within container */
            max-height: 80vh; /* Limit height to 80% of viewport height */
            overflow-y: auto; /* Vertical scroll only */
            overflow-x: hidden; /* No horizontal scroll */
            padding: 8px 0;
        }

        .notification-item, .message-item {
            padding: 20px 30px; /* Increase padding for better readability */
        }

        .menu-header, .menu-footer {
            padding: 20px 30px; /* Consistent padding */
        }


        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
        }

        .header-icon {
            color: #1976d2;
            background: #e3f2fd;
            padding: 8px;
            border-radius: 50%;
        }

        .header-text {
            flex: 1;

            h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 500;
                color: #2c3e50;
            }

            .subtitle {
                font-size: 12px;
                color: #95a5a6;
            }
        }
        

        /* Notification Item Styles */
        .notification-item {
            display: flex;
            padding: 12px 16px;
            gap: 12px;
            transition: background-color 0.2s;
            cursor: pointer;

            &:hover {
                background: #f8f9fa;
            }

            &.unread {
                background: #f1f8ff;

                &:hover {
                    background: #e3f2fd;
                }
            }
        }

        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            &.warn {
                background: #fff3e0;
                color: #f57c00;
            }

            &.accent {
                background: #e3f2fd;
                color: #1976d2;
            }
        }

        .notification-details {
            flex: 1;
        }

        .notification-message {
            font-size: 14px;
            color: #2c3e50;
            margin-bottom: 4px;
        }

        .notification-time {
            font-size: 12px;
            color: #95a5a6;
            margin-bottom: 8px;
        }

        /* Message Item Styles */
        .message-item {
            display: flex;
            padding: 16px;
            gap: 12px;
            transition: background-color 0.2s;
            cursor: pointer;

            &:hover {
                background: #f8f9fa;
            }

            &.unread {
                background: #f1f8ff;

                &:hover {
                    background: #e3f2fd;
                }
            }
        }

        .message-avatar {
            position: relative;
        }

        .avatar-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e3f2fd;
            color: #1976d2;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;

            &.online::after {
                content: '';
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #4caf50;
                border: 2px solid white;
            }
        }

        .message-details {
            flex: 1;
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .sender-name {
            font-weight: 500;
            color: #2c3e50;
        }

        .message-time {
            font-size: 12px;
            color: #95a5a6;
        }

        .message-subject {
            font-size: 14px;
            color: #2c3e50;
            margin-bottom: 4px;
            font-weight: 500;
        }

        .message-preview {
            font-size: 13px;
            color: #7f8c8d;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* Menu Footer Styles */
        .menu-footer {
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            background: #f8f9fa;
        }

        /* Button Styles */
        .view-all-btn {
            color: #1976d2;
            font-weight: 500;
        }

        .mark-read-btn, .new-message-btn {
            color: #1976d2;
        }

        .clear-btn, .archive-btn {
            color: #e74c3c;
        }
        
        
        

        /* User Menu Styles */
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


        .menu-list {
            transition: opacity 3s ease-in-out;
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
            severity: 'accent',
            time: new Date(),
            unread: false
        }
    ];

    constructor(private messagingService: MessagingService, private notificationService: NotificationService) {}

    ngOnInit() {
        this.messagingService.getUnreadMessagesCount().subscribe(count => {
            this.unreadMessagesCount = count;
        });
        this.notificationService.getUnreadNotificationsCount().subscribe(count => {
            this.unreadNotificationsCount = count;
        });
    }

    logout() {
        // TODO: Implement logout functionality
    }

    getNotificationIcon(severity: string): string {
        switch (severity) {
            case 'warn':
                return 'warning';
            case 'accent':
                return 'info';
            default:
                return 'notifications';
        }
    }
}
