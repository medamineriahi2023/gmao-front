import { Component, Input } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { RouterModule } from '@angular/router';
    import { MatSidenavModule } from '@angular/material/sidenav';
    import { MatListModule } from '@angular/material/list';
    import { MatIconModule } from '@angular/material/icon';
    import { MatDividerModule } from '@angular/material/divider';
    import { AuthService } from '../../../services/auth.service';

    @Component({
      selector: 'app-sidebar',
      standalone: true,
      imports: [
        CommonModule,
        RouterModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatDividerModule
      ],
      template: `
        <mat-sidenav-container class="sidenav-container">
          <mat-sidenav [opened]="isOpen" mode="side" class="sidenav">
            <mat-nav-list>
              <a mat-list-item routerLink="/equipments" routerLinkActive="active">
                <mat-icon>inventory_2</mat-icon>
                <span>Équipements</span>
              </a>
              <a mat-list-item routerLink="/work-orders" routerLinkActive="active">
                <mat-icon>assignment</mat-icon>
                <span>Bons de travail</span>
              </a>
              <a mat-list-item routerLink="/contracts" routerLinkActive="active">
                <mat-icon>description</mat-icon>
                <span>Contrats</span>
              </a>
              <a mat-list-item routerLink="/budget" routerLinkActive="active">
                <mat-icon>account_balance</mat-icon>
                <span>Budget</span>
              </a>
              <a mat-list-item routerLink="/purchase-requests" routerLinkActive="active">
                <mat-icon>shopping_cart</mat-icon>
                <span>Achats</span>
              </a>
              <mat-divider></mat-divider>
              <a mat-list-item routerLink="/reports" routerLinkActive="active">
                <mat-icon>assessment</mat-icon>
                <span>Rapports</span>
              </a>
              <a mat-list-item routerLink="/settings" routerLinkActive="active">
                <mat-icon>settings</mat-icon>
                <span>Configuration</span>
              </a>
              <mat-divider></mat-divider>
              <a mat-list-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Déconnexion</span>
              </a>
            </mat-nav-list>
          </mat-sidenav>

          <mat-sidenav-content>
            <div class="content">
              <ng-content></ng-content>
            </div>
          </mat-sidenav-content>
        </mat-sidenav-container>
      `,
      styles: [`
        .sidenav-container {
          height: 90vh;
          margin-top: 60px;
        }

        .sidenav {
          width: 280px;
          background: white;
          border-right: none;
          box-shadow: 2px 0 8px rgba(0,0,0,0.05);
        }

        .sidenav-header {
          display: flex;
          align-items: center;
          padding: 24px 16px;
          background: #f8f9fa;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .header-icon {
          margin-right: 12px;
          color: #9c27b0;
        }

        .header-title {
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
        }

        mat-nav-list {
          padding: 12px 8px;
        }

        mat-nav-list a {
          margin: 4px 0;
          border-radius: 8px;
          height: 48px;
          color: #666;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(0,0,0,0.04);
          }

          mat-icon {
            margin-right: 12px;
            color: #666;
          }

          &.active {
            background: rgba(156,39,176,0.1);
            color: #9c27b0;

            mat-icon {
              color: #9c27b0;
            }
          }
        }

        .content {
          padding: 24px;
          background: #f8f9fa;
          min-height: calc(100vh - 64px);
        }

        mat-divider {
          margin: 12px 0;
        }
      `]
    })
    export class SidebarComponent {
      @Input() isOpen = true;

      constructor(private authService: AuthService) {}

      logout() {
        this.authService.logout();
      }
    }
