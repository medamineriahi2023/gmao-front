import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Equipment } from '../../../models/equipment.model';

@Component({
  selector: 'app-equipment-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <mat-card class="equipment-card" [class.maintenance]="equipment.status === 'En maintenance'">
      <mat-card-header>
        <mat-icon mat-card-avatar [class]="'equipment-type-' + equipment.category.family.toLowerCase()">
          {{getCategoryIcon(equipment.category.family)}}
        </mat-icon>
        <mat-card-title>{{equipment.name}}</mat-card-title>
        <mat-card-subtitle>{{equipment.serialNumber}}</mat-card-subtitle>
        <button mat-icon-button [matMenuTriggerFor]="menu" class="more-button">
          <mat-icon>more_vert</mat-icon>
        </button>
      </mat-card-header>
      
      <mat-card-content>
        <div class="info-grid">
          <div class="info-item">
            <mat-icon>place</mat-icon>
            <div class="info-text">
              <span class="label">Localisation</span>
              <span class="value">{{equipment.location.site}}</span>
              <span class="sub-value">{{equipment.location.building}}</span>
            </div>
          </div>
          
          <div class="info-item">
            <mat-icon>category</mat-icon>
            <div class="info-text">
              <span class="label">Catégorie</span>
              <span class="value">{{equipment.category.family}}</span>
              <span class="sub-value">{{equipment.category.subFamily}}</span>
            </div>
          </div>

          <div class="info-item">
            <mat-icon>build</mat-icon>
            <div class="info-text">
              <span class="label">Dernière maintenance</span>
              <span class="value" *ngIf="equipment.lastMaintenanceDate">
                {{equipment.lastMaintenanceDate | date:'dd/MM/yyyy'}}
              </span>
              <span class="value" *ngIf="!equipment.lastMaintenanceDate">
                Aucune maintenance
              </span>
            </div>
          </div>

          <div class="info-item">
            <mat-icon>euro</mat-icon>
            <div class="info-text">
              <span class="label">Coût total</span>
              <span class="value">{{equipment.totalMaintenanceCost | currency:'EUR'}}</span>
            </div>
          </div>
        </div>

        <div class="status-chip" [ngClass]="'status-' + equipment.status.toLowerCase()">
          {{equipment.status}}
        </div>
      </mat-card-content>

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
    </mat-card>
  `,
  styles: [`
    .equipment-card {
      margin: 16px;
      border-radius: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .equipment-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .equipment-card.maintenance {
      border-left: 4px solid #f57c00;
    }

    .more-button {
      position: absolute;
      right: 8px;
      top: 8px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin: 16px 0;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .info-item mat-icon {
      color: #666;
      font-size: 20px;
    }

    .info-text {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: 12px;
      color: #666;
    }

    .value {
      font-weight: 500;
      color: #2c3e50;
    }

    .sub-value {
      font-size: 12px;
      color: #666;
    }

    .status-chip {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      margin-top: 8px;
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

    .equipment-type-véhicules { color: #1976d2; }
    .equipment-type-matériel { color: #388e3c; }
    .equipment-type-bâtiments { color: #f57c00; }

    .delete-action {
      color: #f44336;
    }
  `]
})
export class EquipmentCardComponent {
  @Input() equipment!: Equipment;
  @Output() onView = new EventEmitter<Equipment>();
  @Output() onEdit = new EventEmitter<Equipment>();
  @Output() onDelete = new EventEmitter<Equipment>();
  @Output() onMaintenance = new EventEmitter<Equipment>();

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Véhicules': 'local_shipping',
      'Matériel': 'construction',
      'Bâtiments': 'business'
    };
    return icons[category] || 'build';
  }
}
