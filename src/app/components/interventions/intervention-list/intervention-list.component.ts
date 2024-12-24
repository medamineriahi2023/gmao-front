import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { Intervention } from '../../../models/intervention.model';
import { InterventionService } from '../../../services/intervention.service';

@Component({
  selector: 'app-intervention-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Interventions</h1>
          <p class="subtitle">Gestion des interventions de maintenance</p>
        </div>
        <button mat-raised-button color="primary" (click)="createIntervention()">
          <mat-icon>add</mat-icon>
          Nouvelle intervention
        </button>
      </div>

      <table mat-table [dataSource]="interventions" class="mat-elevation-z2">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>N°</th>
          <td mat-cell *matCellDef="let intervention">{{intervention.id}}</td>
        </ng-container>

        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let intervention">
            <mat-chip [color]="getTypeColor(intervention.type)" selected>
              {{getTypeLabel(intervention.type)}}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="priority">
          <th mat-header-cell *matHeaderCellDef>Priorité</th>
          <td mat-cell *matCellDef="let intervention">
            <mat-chip [color]="getPriorityColor(intervention.priority)" selected>
              {{getPriorityLabel(intervention.priority)}}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let intervention">
            <mat-chip [ngClass]="'status-' + intervention.status">
              {{getStatusLabel(intervention.status)}}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="plannedDate">
          <th mat-header-cell *matHeaderCellDef>Date prévue</th>
          <td mat-cell *matCellDef="let intervention">
            {{intervention.plannedStartDate | date:'dd/MM/yyyy'}}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let intervention">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="viewDetails(intervention)">
                <mat-icon>visibility</mat-icon>
                <span>Voir détails</span>
              </button>
              <button mat-menu-item (click)="editIntervention(intervention)">
                <mat-icon>edit</mat-icon>
                <span>Modifier</span>
              </button>
              <button mat-menu-item (click)="validateIntervention(intervention)">
                <mat-icon>check_circle</mat-icon>
                <span>Valider</span>
              </button>
              <button mat-menu-item class="delete-action" (click)="deleteIntervention(intervention)">
                <mat-icon>delete</mat-icon>
                <span>Supprimer</span>
              </button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-content h1 {
      margin: 0;
      font-size: 24px;
      color: #1a1a1a;
    }

    .subtitle {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
    }

    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 80px;
      text-align: right;
    }

    .status-draft { background: #e0e0e0; }
    .status-pending { background: #bbdefb; }
    .status-approved { background: #c8e6c9; }
    .status-in_progress { background: #fff3e0; }
    .status-completed { background: #c8e6c9; }
    .status-rejected { background: #ffcdd2; }

    .delete-action {
      color: #f44336;
    }
  `]
})
export class InterventionListComponent implements OnInit {
  interventions: Intervention[] = [];
  displayedColumns = ['id', 'type', 'priority', 'status', 'plannedDate', 'actions'];

  constructor(private interventionService: InterventionService) {}

  ngOnInit() {
    this.loadInterventions();
  }

  loadInterventions() {
    this.interventionService.getInterventions().subscribe(data => {
      this.interventions = data;
    });
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'curative': 'Curative',
      'preventive': 'Préventive',
      'conditional': 'Conditionnelle'
    };
    return labels[type] || type;
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'curative': 'warn',
      'preventive': 'primary',
      'conditional': 'accent'
    };
    return colors[type] || 'primary';
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'low': 'Basse',
      'medium': 'Moyenne',
      'high': 'Haute',
      'critical': 'Critique'
    };
    return labels[priority] || priority;
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      'low': 'primary',
      'medium': 'accent',
      'high': 'warn',
      'critical': 'warn'
    };
    return colors[priority] || 'primary';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'draft': 'Brouillon',
      'pending': 'En attente',
      'approved': 'Approuvée',
      'in_progress': 'En cours',
      'completed': 'Terminée',
      'rejected': 'Rejetée'
    };
    return labels[status] || status;
  }

  createIntervention() {
    // TODO: Implement intervention creation dialog
  }

  viewDetails(intervention: Intervention) {
    // TODO: Implement intervention details view
  }

  editIntervention(intervention: Intervention) {
    // TODO: Implement intervention edit dialog
  }

  validateIntervention(intervention: Intervention) {
    // TODO: Implement intervention validation dialog
  }

  deleteIntervention(intervention: Intervention) {
    // TODO: Implement intervention deletion with confirmation
  }
}
