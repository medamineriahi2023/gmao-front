import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Contract } from '../../../models/contract.model';

@Component({
  selector: 'app-contract-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule],
  template: `
    <div class="details-container" *ngIf="contract">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>description</mat-icon>
          <mat-card-title>{{contract.title}}</mat-card-title>
          <mat-card-subtitle>{{contract.reference}}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="info-section">
            <h3>Description</h3>
            <p>{{contract.description}}</p>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Fournisseur</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Nom</span>
                <span class="value">{{contract.provider.name}}</span>
              </div>
              <div class="info-item">
                <span class="label">Contact</span>
                <span class="value">{{contract.provider.contact}}</span>
              </div>
              <div class="info-item">
                <span class="label">Email</span>
                <span class="value">{{contract.provider.email}}</span>
              </div>
              <div class="info-item">
                <span class="label">Téléphone</span>
                <span class="value">{{contract.provider.phone}}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Détails du contrat</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Type</span>
                <span class="value">{{getTypeLabel(contract.type)}}</span>
              </div>
              <div class="info-item">
                <span class="label">Statut</span>
                <span class="value status-chip" [ngClass]="'status-' + contract.status">
                  {{getStatusLabel(contract.status)}}
                </span>
              </div>
              <div class="info-item">
                <span class="label">Valeur</span>
                <span class="value">{{contract.value | currency:'EUR'}}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Dates</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Date de début</span>
                <span class="value">{{contract.startDate | date:'dd/MM/yyyy'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Date de fin</span>
                <span class="value">{{contract.endDate | date:'dd/MM/yyyy'}}</span>
              </div>
              <div class="info-item" *ngIf="contract.lastRenewalDate">
                <span class="label">Dernier renouvellement</span>
                <span class="value">{{contract.lastRenewalDate | date:'dd/MM/yyyy'}}</span>
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

    .status-chip {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-active { background: #e8f5e9; color: #2e7d32; }
    .status-expired { background: #ffebee; color: #c62828; }
    .status-pending { background: #e3f2fd; color: #1565c0; }
    .status-terminated { background: #fafafa; color: #616161; }
  `]
})
export class ContractDetailsComponent {
  @Input() contract: Contract | null = null;

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'maintenance': 'Maintenance',
      'inspection': 'Inspection',
      'support': 'Support',
      'service': 'Service'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'active': 'Actif',
      'expired': 'Expiré',
      'pending': 'En attente',
      'terminated': 'Résilié'
    };
    return labels[status] || status;
  }
}
