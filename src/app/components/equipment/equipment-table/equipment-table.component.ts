import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipment } from '../../../models/equipment.model';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-equipment-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <table mat-table [dataSource]="equipments" matSort class="mat-elevation-z2 equipment-table">
      <!-- Nom Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
        <td mat-cell *matCellDef="let equipment">
          <div class="name-cell">
            <mat-icon [class]="'equipment-type-' + equipment.category.family.toLowerCase()">
              {{getCategoryIcon(equipment.category.family)}}
            </mat-icon>
            {{equipment.name}}
          </div>
        </td>
      </ng-container>

      <!-- Numéro de série Column -->
      <ng-container matColumnDef="serialNumber">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>N° Série</th>
        <td mat-cell *matCellDef="let equipment">{{equipment.serialNumber}}</td>
      </ng-container>

      <!-- Localisation Column -->
      <ng-container matColumnDef="location">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Localisation</th>
        <td mat-cell *matCellDef="let equipment">
          {{equipment.location.site}} - {{equipment.location.building}}
        </td>
      </ng-container>

      <!-- Statut Column -->
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
        <td mat-cell *matCellDef="let equipment">
          <div class="status-chip" [ngClass]="'status-' + equipment.status.toLowerCase()">
            {{equipment.status}}
          </div>
        </td>
      </ng-container>

      <!-- Dernière maintenance Column -->
      <ng-container matColumnDef="lastMaintenance">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Dernière maintenance</th>
        <td mat-cell *matCellDef="let equipment">
          {{equipment.lastMaintenanceDate | date:'dd/MM/yyyy' || 'Aucune'}}
        </td>
      </ng-container>

      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let equipment">
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Actions">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onView.emit(equipment)">
              <mat-icon>visibility</mat-icon>
              <span>Voir détails</span>
            </button>
            <button mat-menu-item (click)="onEdit.emit(equipment)">
              <mat-icon>edit</mat-icon>
              <span>Modifier</span>
            </button>
            <button mat-menu-item (click)="onMaintenance.emit(equipment)">
              <mat-icon>build</mat-icon>
              <span>Planifier maintenance</span>
            </button>
            <button mat-menu-item class="delete-action" (click)="onDelete.emit(equipment)">
              <mat-icon>delete</mat-icon>
              <span>Supprimer</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
    .equipment-table {
      width: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .name-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .equipment-type-véhicules { color: #1976d2; }
    .equipment-type-matériel { color: #388e3c; }
    .equipment-type-bâtiments { color: #f57c00; }

    .status-chip {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-fonctionnel {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-en.maintenance {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-à.remplacer {
      background-color: #ffebee;
      color: #c62828;
    }

    .delete-action {
      color: #f44336;
    }

    tr.mat-mdc-row:hover {
      background: #f5f5f5;
    }
  `]
})
export class EquipmentTableComponent {
  @Input() equipments: Equipment[] = [];
  @Output() onView = new EventEmitter<Equipment>();
  @Output() onEdit = new EventEmitter<Equipment>();
  @Output() onDelete = new EventEmitter<Equipment>();
  @Output() onMaintenance = new EventEmitter<Equipment>();

  displayedColumns: string[] = ['name', 'serialNumber', 'location', 'status', 'lastMaintenance', 'actions'];

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Véhicules': 'local_shipping',
      'Matériel': 'construction',
      'Bâtiments': 'business'
    };
    return icons[category] || 'build';
  }
}
