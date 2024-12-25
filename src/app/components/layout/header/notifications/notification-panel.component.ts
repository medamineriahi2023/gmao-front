import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    RippleModule,
    BadgeModule
  ],
  template: `
    <button class="icon-button" (click)="op.toggle($event)">
      <i class="pi pi-bell"></i>
      <span *ngIf="unreadCount > 0" class="badge">{{unreadCount}}</span>
    </button>

    <p-overlayPanel #op [showCloseIcon]="true" [style]="{width: '400px'}">
      <ng-template pTemplate>
        <div class="notification-panel">
          <div class="panel-header">
            <h3>Notifications</h3>
            <span class="unread-count" *ngIf="unreadCount > 0">{{unreadCount}} new</span>
          </div>
          
          <div class="notification-list">
            <div *ngFor="let notification of notifications" 
                 class="notification-item"
                 [class.unread]="notification.unread">
              <div class="notification-icon" [ngClass]="notification.severity">
                <i class="pi" [ngClass]="getNotificationIcon(notification.severity)"></i>
              </div>
              <div class="notification-content">
                <p class="message">{{notification.message}}</p>
                <span class="time">{{notification.time | date:'shortTime'}}</span>
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <p-button 
                    label="Mark all as read" 
                    icon="pi pi-check" 
                    styleClass="p-button-text">
            </p-button>
            <p-button 
                    label="View all" 
                    icon="pi pi-arrow-right"
                    styleClass="p-button-text">
            </p-button>
          </div>
        </div>
      </ng-template>
    </p-overlayPanel>
  `,
  styles: [`
    .icon-button {
      position: relative;
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      .pi {
        font-size: 1.4rem;
        color: rgba(0, 0, 0, 0.7);
      }

      .badge {
        position: absolute;
        top: 0;
        right: 0;
        background: #dc3545;
        color: white;
        border-radius: 10px;
        padding: 2px 6px;
        font-size: 12px;
        min-width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
      }
    }

    .notification-panel {
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--surface-border);

        h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .unread-count {
          color: var(--primary-color);
          font-weight: 600;
        }
      }

      .notification-list {
        max-height: 400px;
        overflow-y: auto;

        .notification-item {
          display: flex;
          align-items: flex-start;
          padding: 1rem;
          gap: 1rem;
          border-bottom: 1px solid var(--surface-border);
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: var(--surface-hover);
          }

          &.unread {
            background-color: var(--primary-50);
          }

          .notification-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            &.warn {
              background-color: var(--orange-50);
              color: var(--orange-500);
            }

            &.info {
              background-color: var(--primary-50);
              color: var(--primary-500);
            }

            .pi {
              font-size: 1.2rem;
            }
          }

          .notification-content {
            flex: 1;

            .message {
              margin: 0 0 0.5rem 0;
              color: var(--text-color);
            }

            .time {
              font-size: 0.875rem;
              color: var(--text-color-secondary);
            }
          }
        }
      }

      .panel-footer {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        border-top: 1px solid var(--surface-border);
      }
    }
  `]
})
export class NotificationPanelComponent {
  @Input() unreadCount = 0;
  @Input() notifications: any[] = [];
  @ViewChild('op') op!: OverlayPanel;

  getNotificationIcon(severity: string): string {
    switch (severity) {
      case 'warn':
        return 'pi-exclamation-triangle';
      case 'info':
        return 'pi-info-circle';
      default:
        return 'pi-bell';
    }
  }
}