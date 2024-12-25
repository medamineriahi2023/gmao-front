import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-message-panel',
  standalone: true,
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    RippleModule,
    BadgeModule,
    AvatarModule
  ],
  template: `
    <button class="icon-button" (click)="op.toggle($event)">
      <i class="pi pi-envelope"></i>
      <span *ngIf="unreadCount > 0" class="badge">{{unreadCount}}</span>
    </button>

    <p-overlayPanel #op [showCloseIcon]="true" [style]="{width: '400px'}">
      <ng-template pTemplate>
        <div class="message-panel">
          <div class="panel-header">
            <h3>Messages</h3>
            <span class="unread-count" *ngIf="unreadCount > 0">{{unreadCount}} unread</span>
          </div>
          
          <div class="message-list">
            <div *ngFor="let message of messages" 
                 class="message-item"
                 [class.unread]="message.unread">
              <p-avatar [label]="message.sender.charAt(0)"
                       [style]="{'background-color': message.isOnline ? 'var(--green-100)' : 'var(--surface-200)'}"
                       [styleClass]="message.isOnline ? 'text-green-700' : 'text-surface-700'"
                       shape="circle">
                <ng-template pTemplate="indicator">
                  <span class="online-indicator" *ngIf="message.isOnline"></span>
                </ng-template>
              </p-avatar>
              
              <div class="message-content">
                <div class="message-header">
                  <span class="sender">{{message.sender}}</span>
                  <span class="time">{{message.time | date:'shortTime'}}</span>
                </div>
                <p class="subject">{{message.subject}}</p>
                <p class="preview">{{message.preview}}</p>
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <p-button 
                    label="New Message" 
                    icon="pi pi-plus" 
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

    .message-panel {
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

      .message-list {
        max-height: 400px;
        overflow-y: auto;

        .message-item {
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

          :host ::ng-deep .p-avatar {
            position: relative;

            .online-indicator {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: var(--green-500);
              border: 2px solid var(--surface-0);
            }
          }

          .message-content {
            flex: 1;
            min-width: 0;

            .message-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.5rem;

              .sender {
                font-weight: 600;
                color: var(--text-color);
              }

              .time {
                font-size: 0.875rem;
                color: var(--text-color-secondary);
              }
            }

            .subject {
              margin: 0 0 0.5rem 0;
              font-weight: 500;
              color: var(--text-color);
            }

            .preview {
              margin: 0;
              font-size: 0.875rem;
              color: var(--text-color-secondary);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
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
export class MessagePanelComponent {
  @Input() unreadCount = 0;
  @Input() messages: any[] = [];
  @ViewChild('op') op!: OverlayPanel;
}