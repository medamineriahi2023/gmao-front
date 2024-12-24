import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent
  ],
  template: `
    <div class="app-container">
      <app-header (menuToggled)="toggleSidenav()"></app-header>
      <app-sidebar [isOpen]="sidenavOpen">
        <router-outlet></router-outlet>
      </app-sidebar>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  sidenavOpen = true;

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }
}
