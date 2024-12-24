import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WorkOrder } from '../../../models/work-order.model';
import { WorkOrderService } from '../../../services/work-order.service';
import { WorkOrderActionsService } from '../../../services/work-order-actions.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { WorkOrderFormDialogComponent } from '../work-order-form/work-order-form-dialog.component';
import { WorkOrderDetailsDialogComponent } from '../work-order-details/work-order-details-dialog.component';

@Component({
  selector: 'app-work-order-list',
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
          <h1>Bons de travail</h1>
          <p class="subtitle">Liste des bons de travail</p>
        </div>
        <button mat-raised-button color="primary" (click)="createWorkOrder()">
          <mat-icon>add</mat-icon>
          Nouveau bon de travail
        </button>
      </div>

      <table mat-table [dataSource]="workOrders" class="mat-elevation-z2">
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>N°</th>
          <td mat-cell *matCellDef="let workOrder">{{workOrder.id}}</td>
        </ng-container>

        <!-- Title Column -->
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Titre</th>
          <td mat-cell *matCellDef="let workOrder">{{workOrder.title}}</td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let workOrder">
            <mat-chip [ngClass]="'status-' + workOrder.status">
              {{getStatusLabel(workOrder.status)}}
            </mat-chip>
          </td>
        </ng-container>

        <!-- Priority Column -->
        <ng-container matColumnDef="priority">
          <th mat-header-cell *matHeaderCellDef>Priorité</th>
          <td mat-cell *matCellDef="let workOrder">
            <mat-chip [ngClass]="'priority-' + workOrder.priority">
              {{getPriorityLabel(workOrder.priority)}}
            </mat-chip>
          </td>
        </ng-container>

        <!-- Date Column -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date prévue</th>
          <td mat-cell *matCellDef="let workOrder">
            {{workOrder.plannedStartDate | date:'dd/MM/yyyy'}}
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let workOrder">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="viewDetails(workOrder)">
                <mat-icon>visibility</mat-icon>
                <span>Voir détails</span>
              </button>
              <button mat-menu-item (click)="editWorkOrder(workOrder)">
                <mat-icon>edit</mat-icon>
                <span>Modifier</span>
              </button>
              <button mat-menu-item *ngIf="workOrder.status === 'planned'"
                      (click)="startWorkOrder(workOrder)">
                <mat-icon>play_arrow</mat-icon>
                <span>Démarrer</span>
              </button>
              <button mat-menu-item *ngIf="workOrder.status === 'in_progress'"
                      (click)="completeWorkOrder(workOrder)">
                <mat-icon>check</mat-icon>
                <span>Terminer</span>
              </button>
              <button mat-menu-item class="delete-action" (click)="deleteWorkOrder(workOrder)">
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

    .status-draft { background: #e0e0e0; }
    .status-planned { background: #bbdefb; }
    .status-in_progress { background: #fff3e0; }
    .status-completed { background: #c8e6c9; }
    .status-cancelled { background: #ffcdd2; }

    .priority-low { background: #e8f5e9; color: #2e7d32; }
    .priority-medium { background: #fff3e0; color: #f57c00; }
    .priority-high { background: #ffebee; color: #c62828; }
    .priority-urgent { background: #ff5252; color: white; }

    .delete-action {
      color: #f44336;
    }
  `]
})
export class WorkOrderListComponent implements OnInit {
  workOrders: WorkOrder[] = [];
  displayedColumns = ['id', 'title', 'status', 'priority', 'date', 'actions'];

  constructor(
    private workOrderService: WorkOrderService,
    private workOrderActions: WorkOrderActionsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadWorkOrders();
  }

  loadWorkOrders() {
    this.workOrderService.getWorkOrders().subscribe(
      workOrders => this.workOrders = workOrders
    );
  }

  startWorkOrder(workOrder: WorkOrder) {
    this.workOrderActions.startWorkOrder(workOrder).subscribe(() => {
      this.loadWorkOrders();
    });
  }

  completeWorkOrder(workOrder: WorkOrder) {
    this.workOrderActions.completeWorkOrder(workOrder).subscribe(() => {
      this.loadWorkOrders();
    });
  }

  createWorkOrder() {
    const dialogRef = this.dialog.open(WorkOrderFormDialogComponent, {
      width: '800px',
      data: { workOrder: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workOrderService.createWorkOrder(result).subscribe(() => {
          this.loadWorkOrders();
          this.snackBar.open('Bon de travail créé avec succès', 'Fermer', {
            duration: 3000
          });
        });
      }
    });
  }

  editWorkOrder(workOrder: WorkOrder) {
    const dialogRef = this.dialog.open(WorkOrderFormDialogComponent, {
      width: '800px',
      data: { workOrder }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workOrderService.updateWorkOrder({ ...workOrder, ...result }).subscribe(() => {
          this.loadWorkOrders();
          this.snackBar.open('Bon de travail modifié avec succès', 'Fermer', {
            duration: 3000
          });
        });
      }
    });
  }

  viewDetails(workOrder: WorkOrder) {
    this.dialog.open(WorkOrderDetailsDialogComponent, {
      width: '1000px',
      data: { workOrder }
    });
  }

  deleteWorkOrder(workOrder: WorkOrder) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer le bon de travail',
        message: 'Êtes-vous sûr de vouloir supprimer ce bon de travail ?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workOrderService.deleteWorkOrder(workOrder.id).subscribe(() => {
          this.loadWorkOrders();
          this.snackBar.open('Bon de travail supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        });
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'draft': 'Brouillon',
      'planned': 'Planifié',
      'in_progress': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'low': 'Basse',
      'medium': 'Moyenne',
      'high': 'Haute',
      'urgent': 'Urgente'
    };
    return labels[priority] || priority;
  }
}
