import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkOrder } from '../../../models/work-order.model';
import { WorkOrderService } from '../../../services/work-order.service';
import { WorkOrderFormDialogComponent } from '../work-order-form/work-order-form-dialog.component';
import { WorkOrderDetailsDialogComponent } from '../work-order-details/work-order-details-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="work-orders-container">
      <div class="header">
        <div>
          <h1>Bons de travail</h1>
          <p class="subtitle">Liste des bons de travail</p>
        </div>
        <button mat-raised-button color="primary" (click)="openCreateDialog()" *ngIf="!isTechnician">
          <mat-icon>add</mat-icon>
          Nouveau bon de travail
        </button>
      </div>

      <div class="content">
        <div *ngIf="workOrders.length === 0" class="no-data">
          <mat-icon>assignment</mat-icon>
          <p>{{ getNoDataMessage() }}</p>
        </div>

        <table mat-table [dataSource]="workOrders" class="mat-elevation-z2" *ngIf="workOrders.length > 0">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>N°</th>
            <td mat-cell *matCellDef="let workOrder">#{{workOrder.id}}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let workOrder">
              <span class="badge" [ngClass]="'type-' + workOrder.type">
                {{workOrder.type === 'corrective' ? 'Correctif' : 'Préventif'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Titre</th>
            <td mat-cell *matCellDef="let workOrder">{{workOrder.title}}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let workOrder">
              <span class="badge" [ngClass]="'status-' + workOrder.status">
                {{getStatusLabel(workOrder.status)}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef>Priorité</th>
            <td mat-cell *matCellDef="let workOrder">
              <span class="badge" [ngClass]="'priority-' + workOrder.priority">
                {{getPriorityLabel(workOrder.priority)}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="plannedStartDate">
            <th mat-header-cell *matHeaderCellDef>Date prévue</th>
            <td mat-cell *matCellDef="let workOrder">
              {{workOrder.plannedStartDate | date:'dd/MM/yyyy'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let workOrder">
              <button mat-icon-button color="primary" (click)="openDetailsDialog(workOrder)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="openEditDialog(workOrder)" *ngIf="!isTechnician">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteWorkOrder(workOrder)" *ngIf="!isTechnician">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .work-orders-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .subtitle {
      margin: 4px 0 0;
      color: #666;
    }

    .content {
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 120px;
      text-align: right;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .type-corrective { background: #ffebee; color: #c62828; }
    .type-preventive { background: #e3f2fd; color: #1565c0; }

    .status-draft { background: #f5f5f5; color: #616161; }
    .status-planned { background: #e3f2fd; color: #1565c0; }
    .status-in_progress { background: #fff3e0; color: #f57c00; }
    .status-completed { background: #e8f5e9; color: #2e7d32; }
    .status-cancelled { background: #ffebee; color: #c62828; }

    .priority-low { background: #e8f5e9; color: #2e7d32; }
    .priority-medium { background: #fff3e0; color: #f57c00; }
    .priority-high { background: #ffebee; color: #c62828; }
    .priority-urgent { background: #ff5252; color: white; }

    .no-data {
      padding: 48px;
      text-align: center;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
  `]
})
export class WorkOrderListComponent implements OnInit {
  workOrders: WorkOrder[] = [];
  displayedColumns = ['id', 'type', 'title', 'status', 'priority', 'plannedStartDate', 'actions'];
  isTechnician: boolean = false;

  constructor(
    private workOrderService: WorkOrderService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.isTechnician = this.authService.getCurrentUser()?.role === 'technician';
  }

  ngOnInit() {
    this.loadWorkOrders();
  }

  loadWorkOrders() {
    this.workOrderService.getWorkOrders().subscribe(
      workOrders => this.workOrders = workOrders
    );
  }

  getNoDataMessage(): string {
    if (this.isTechnician) {
      return 'Aucun bon de travail ne vous est assigné pour le moment.';
    }
    return 'Aucun bon de travail n\'a été créé pour le moment.';
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

  openCreateDialog() {
    const dialogRef = this.dialog.open(WorkOrderFormDialogComponent, {
      width: '800px',
      data: { workOrder: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workOrderService.createWorkOrder(result).subscribe({
          next: () => {
            this.loadWorkOrders();
            this.snackBar.open('Bon de travail créé avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Erreur lors de la création du bon de travail', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  openEditDialog(workOrder: WorkOrder) {
    const dialogRef = this.dialog.open(WorkOrderFormDialogComponent, {
      width: '800px',
      data: { workOrder }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workOrderService.updateWorkOrder({ ...workOrder, ...result }).subscribe({
          next: () => {
            this.loadWorkOrders();
            this.snackBar.open('Bon de travail modifié avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Erreur lors de la modification du bon de travail', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  openDetailsDialog(workOrder: WorkOrder) {
    this.dialog.open(WorkOrderDetailsDialogComponent, {
      width: '800px',
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
        this.workOrderService.deleteWorkOrder(workOrder.id).subscribe({
          next: () => {
            this.loadWorkOrders();
            this.snackBar.open('Bon de travail supprimé avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Erreur lors de la suppression du bon de travail', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}
