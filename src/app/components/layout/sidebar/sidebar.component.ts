import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    PanelMenuModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav [opened]="isOpen" mode="side" class="sidenav">
        <div class="sidebar-content">
          <p-panelMenu [model]="menuItems" [multiple]="false" styleClass="modern-sidebar"></p-panelMenu>
        </div>
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
      background: var(--surface-overlay);
      border-right: none;
      box-shadow: var(--card-shadow);
    }

    .sidebar-content {
      padding: 1rem;
    }

    ::ng-deep {
      .modern-sidebar {
        border: none;
        background: transparent;

        .p-component {
          border: none;
          background: transparent;
        }

        .p-panelmenu-header-link {
          border: none;
          border-radius: 12px;
          margin: 0.25rem 0;
          padding: 1rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          
          &:hover {
            background: var(--surface-hover);
            transform: translateX(4px);
          }

          &:focus {
            box-shadow: none;
          }

          .p-menuitem-icon {
            margin-right: 0.75rem;
            color: var(--text-color-secondary);
          }

          .p-menuitem-text {
            color: var(--text-color);
            font-weight: 500;
          }

          .p-submenu-icon {
            color: var(--text-color-secondary);
          }
        }

        .p-panelmenu-header-link[aria-expanded="true"] {
          background: linear-gradient(
            135deg,
            var(--primary-100),
            var(--primary-50)
          );

          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background: var(--primary-color);
            border-radius: 0 4px 4px 0;
          }

          .p-menuitem-icon,
          .p-menuitem-text,
          .p-submenu-icon {
            color: var(--primary-color);
          }
        }

        .p-panelmenu-content {
          border: none;
          background: transparent;
          margin-left: 1rem;
        }

        .p-menuitem {
          margin: 0.25rem 0;
        }

        .p-menuitem-link {
          border-radius: 12px;
          padding: 0.75rem 1rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;

          &:hover {
            background: var(--surface-hover);
            transform: translateX(4px);
          }

          &:focus {
            box-shadow: none;
          }

          &.router-link-active {
            background: linear-gradient(
              135deg,
              var(--primary-100),
              var(--primary-50)
            );

            &:before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              height: 100%;
              width: 4px;
              background: var(--primary-color);
              border-radius: 0 4px 4px 0;
            }

            .p-menuitem-icon,
            .p-menuitem-text {
              color: var(--primary-color);
              font-weight: 600;
            }
          }

          .p-menuitem-icon {
            margin-right: 0.75rem;
            color: var(--text-color-secondary);
          }

          .p-menuitem-text {
            color: var(--text-color);
            font-weight: 500;
          }
        }
      }
    }

    .content {
      padding: 24px;
      background: var(--surface-ground);
      min-height: calc(100vh - 64px);
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = true;
  menuItems: MenuItem[];

  constructor(private authService: AuthService) {
    this.menuItems = [
      {
        label: 'Tableau de bord',
        icon: 'pi pi-th-large',
        items: [
          {
            label: 'Budget',
            icon: 'pi pi-wallet',
            routerLink: '/dashboard/budget'
          }
        ]
      },
      {
        label: 'Équipements',
        icon: 'pi pi-box',
        routerLink: '/equipments'
      },
      {
        label: 'Bons de travail',
        icon: 'pi pi-file',
        routerLink: '/work-orders'
      },
      {
        label: 'Contrats',
        icon: 'pi pi-file-pdf',
        routerLink: '/contracts'
      },
      {
        label: 'Budget',
        icon: 'pi pi-wallet',
        routerLink: '/budget'
      },
      {
        label: 'Achats',
        icon: 'pi pi-shopping-cart',
        routerLink: '/purchase-requests'
      },
      {
        label: 'Messages',
        icon: 'pi pi-comments',
        routerLink: '/messages'
      },
      {
        label: 'Rapports',
        icon: 'pi pi-chart-bar',
        routerLink: '/reports'
      },
      {
        label: 'Configuration',
        icon: 'pi pi-cog',
        routerLink: '/settings'
      },
      {
        label: 'Déconnexion',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout() {
    this.authService.logout();
  }
}