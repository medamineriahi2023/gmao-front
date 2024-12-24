import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Equipment } from '../../../models/equipment.model';

@Component({
  selector: 'app-equipment-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <div class="details-container" *ngIf="equipment">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar [class]="'equipment-type-' + equipment.category.family.toLowerCase()">
            {{getCategoryIcon(equipment.category.family)}}
          </mat-icon>
          <mat-card-title>{{equipment.name}}</mat-card-title>
          <mat-card-subtitle>{{equipment.serialNumber}}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="status-section">
            <div class="status-chip" [ngClass]="'status-' + equipment.status.toLowerCase()">
              {{equipment.status}}
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Informations générales</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Type</span>
                <span class="value">{{equipment.type}}</span>
              </div>
              <div class="info-item">
                <span class="label">Catégorie</span>
                <span class="value">{{equipment.category.family}} - {{equipment.category.subFamily}}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Localisation</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Site</span>
                <span class="value">{{equipment.location.site}}</span>
              </div>
              <div class="info-item">
                <span class="label">Bâtiment</span>
                <span class="value">{{equipment.location.building}}</span>
              </div>
              <div class="info-item">
                <span class="label">Département</span>
                <span class="value">{{equipment.location.department}}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Maintenance</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Dernière maintenance</span>
                <span class="value">{{equipment.lastMaintenanceDate | date:'dd/MM/yyyy' || 'Aucune'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Prochaine maintenance</span>
                <span class="value">{{equipment.nextMaintenanceDate | date:'dd/MM/yyyy' || 'Non planifiée'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Coût total maintenance</span>
                <span class="value">{{equipment.totalMaintenanceCost | currency:'EUR'}}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .details-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .status-section {
      margin: 16px 0;
    }

    .info-section {
      padding: 16px 0;
    }

    .info-section h3 {
      margin-bottom: 16px;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .label {
      font-size: 12px;
      color: #666;
    }

    .value {
      font-size: 14px;
      color: #333;
      font-weight: 500;
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
  `]
})
export class EquipmentDetailsComponent {
  @Input() equipment: Equipment | null = null;

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Véhicules': 'local_shipping',
      'Matériel': 'construction',
      'Bâtiments': 'business'
    };
    return icons[category] || 'build';
  }
}
