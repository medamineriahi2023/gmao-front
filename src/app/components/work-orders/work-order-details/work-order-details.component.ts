import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MarkdownModule } from 'ngx-markdown';
import { WorkOrder } from '../../../models/work-order.model';
import { WorkOrderService } from '../../../services/work-order.service';
import { WorkOrderActionsService } from '../../../services/work-order-actions.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Equipment } from '../../../models/equipment.model';
import { MockDataService } from '../../../services/mock-data.service';
import { WorkOrderPlanningDialogComponent } from '../work-order-planning/work-order-planning-dialog.component';
import { PurchaseRequestDialogComponent } from '../purchase-request-dialog/purchase-request-dialog.component';
import { PurchaseRequest, PurchaseRequestStatus } from '../../../models/purchase-request.model';

@Component({
  selector: 'app-work-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatCardModule,
    MarkdownModule
  ],
  template: `
    <div class="details-container" *ngIf="workOrder">
      <!-- Header Section -->
      <div class="header-section">
        <div class="title-section">
          <h2>Bon de travail #{{workOrder.id}}</h2>
          <div class="status-chips">
            <span class="badge type-{{workOrder.type}}">
              {{workOrder.type === 'corrective' ? 'Correctif' : 'Préventif'}}
            </span>
            <span class="badge status-{{workOrder.status}}">
              {{getStatusLabel(workOrder.status)}}
            </span>
            <span class="badge priority-{{workOrder.priority}}">
              {{getPriorityLabel(workOrder.priority)}}
            </span>
          </div>
        </div>
        
        <div class="action-buttons" *ngIf="canShowActionButtons()">
          <button mat-raised-button color="primary" 
                  *ngIf="workOrder.status === 'planned'"
                  (click)="startWorkOrder()">
            <mat-icon>play_arrow</mat-icon>
            Démarrer
          </button>
          <button mat-raised-button color="accent" 
                  *ngIf="workOrder.status === 'in_progress'"
                  (click)="completeWorkOrder()">
            <mat-icon>check</mat-icon>
            Terminer
          </button>
          <button mat-raised-button color="warn" 
                  *ngIf="workOrder.status === 'planned' || workOrder.status === 'in_progress'"
                  (click)="cancelWorkOrder()">
            <mat-icon>cancel</mat-icon>
            Annuler
          </button>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Content Section -->
      <mat-tab-group>
        <!-- Details Tab -->
        <mat-tab label="Détails">
          <div class="tab-content">
            <div class="info-grid">
              <div class="info-section">
                <h3>Informations générales</h3>
                <div class="info-item">
                  <span class="label">Titre :</span>
                  <span>{{workOrder.title}}</span>
                </div>
                <div class="info-item">
                  <span class="label">Description :</span>
                  <span>{{workOrder.description}}</span>
                </div>
                <div class="info-item">
                  <span class="label">Date prévue :</span>
                  <span>{{workOrder.plannedStartDate | date:'dd/MM/yyyy'}}</span>
                </div>
                <div class="info-item" *ngIf="workOrder.actualStartDate">
                  <span class="label">Date de début :</span>
                  <span>{{workOrder.actualStartDate | date:'dd/MM/yyyy HH:mm'}}</span>
                </div>
                <div class="info-item" *ngIf="workOrder.actualEndDate">
                  <span class="label">Date de fin :</span>
                  <span>{{workOrder.actualEndDate | date:'dd/MM/yyyy HH:mm'}}</span>
                </div>
              </div>

              <div class="info-section">
                <h3>Équipement</h3>
                <div class="info-item" *ngIf="equipment">
                  <span class="label">Nom :</span>
                  <span>{{equipment.name}}</span>
                </div>
                <div class="info-item" *ngIf="equipment">
                  <span class="label">Numéro de série :</span>
                  <span>{{equipment.serialNumber}}</span>
                </div>
              </div>

              <div class="info-section">
                <h3>Technicien assigné</h3>
                <div class="info-item" *ngIf="assignedTechnician">
                  <mat-icon>person</mat-icon>
                  <span>{{assignedTechnician.firstName}} {{assignedTechnician.lastName}}</span>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Tasks Tab -->
        <mat-tab label="Tâches">
          <div class="tab-content">
            <div class="tasks-list">
              <div *ngFor="let task of workOrder.tasks" class="task-item">
                <div class="task-header">
                  <span class="task-description">{{task.description}}</span>
                  <div class="task-actions">
                    <span class="badge status-{{task.status}}">
                      {{getTaskStatusLabel(task.status)}}
                    </span>
                    <button mat-raised-button color="accent"
                            *ngIf="canShowActionButtons() && workOrder.status === 'in_progress' && task.status !== 'completed'"
                            (click)="completeTask(task.id)">
                      <mat-icon>check</mat-icon>
                      Terminer
                    </button>
                  </div>
                </div>
                <div class="task-details">
                  <div class="task-info">
                    <span class="label">Durée estimée :</span>
                    <span>{{task.estimatedDuration}} minutes</span>
                  </div>
                  <div class="task-info" *ngIf="task.actualDuration">
                    <span class="label">Durée réelle :</span>
                    <span>{{task.actualDuration}} minutes</span>
                  </div>
                  <div class="task-notes" *ngIf="task.technicianNotes">
                    <span class="label">Notes :</span>
                    <span>{{task.technicianNotes}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Demandes d'achat Tab -->
        <mat-tab label="Demandes d'achat">
          <div class="tab-content">
            <div class="purchase-requests-section">
              <div class="section-header">
                <h3>Demandes d'achat de pièces</h3>
                <button mat-raised-button color="primary" (click)="openPurchaseRequestDialog()">
                  <mat-icon>add_shopping_cart</mat-icon>
                  Nouvelle demande
                </button>
              </div>

              <div class="purchase-requests-list" *ngIf="workOrder.purchaseRequests?.length">
                <mat-card *ngFor="let request of workOrder.purchaseRequests" class="request-card">
                  <mat-card-header>
                    <mat-card-title>{{request.item}}</mat-card-title>
                    <mat-card-subtitle>
                      Quantité : {{request.quantity}}
                      <span [class]="'status-badge status-' + request.status">
                        {{getPurchaseRequestStatusLabel(request.status)}}
                      </span>
                    </mat-card-subtitle>
                  </mat-card-header>
                  
                  <mat-card-content>
                    <p>{{request.description}}</p>
                    <div class="request-details">
                      <p><strong>Demandé par :</strong> {{request.requestedBy}}</p>
                      <p *ngIf="request.status !== 'pending'">
                        <strong>Dernière mise à jour :</strong> {{request.updatedAt | date:'dd/MM/yyyy HH:mm'}}
                      </p>
                    </div>
                  </mat-card-content>

                  <mat-card-actions align="end">
                    <button mat-button color="primary" 
                            *ngIf="request.status === 'pending'"
                            (click)="updatePurchaseRequestStatus(request, 'approved')">
                      <mat-icon>check</mat-icon>
                      Approuver
                    </button>
                    <button mat-button color="accent" 
                            *ngIf="request.status === 'approved'"
                            (click)="updatePurchaseRequestStatus(request, 'ordered')">
                      <mat-icon>shopping_cart</mat-icon>
                      Marquer comme commandé
                    </button>
                    <button mat-button color="accent" 
                            *ngIf="request.status === 'ordered'"
                            (click)="updatePurchaseRequestStatus(request, 'received')">
                      <mat-icon>inventory</mat-icon>
                      Marquer comme reçu
                    </button>
                    <button mat-button color="warn" 
                            *ngIf="request.status === 'pending'"
                            (click)="updatePurchaseRequestStatus(request, 'rejected')">
                      <mat-icon>close</mat-icon>
                      Rejeter
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>

              <div class="no-requests" *ngIf="!workOrder.purchaseRequests?.length">
                <p>Aucune demande d'achat pour ce bon de travail</p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Comments Tab -->
        <mat-tab label="Commentaires">
          <div class="tab-content">
            <div class="comments-list">
              <div *ngFor="let comment of workOrder.comments" class="comment-item">
                <div class="comment-header">
                  <span class="comment-author">{{comment.author}}</span>
                  <span class="comment-date">{{comment.createdAt | date:'dd/MM/yyyy HH:mm'}}</span>
                </div>
                <div class="comment-content" markdown [data]="comment.content"></div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .details-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .title-section h2 {
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: 500;
    }

    .status-chips {
      display: flex;
      gap: 8px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
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

    .tab-content {
      padding: 24px 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .info-section {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
    }

    .info-section h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #333;
    }

    .info-item {
      margin-bottom: 12px;
    }

    .info-item .label {
      font-weight: 500;
      color: #666;
      margin-right: 8px;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .task-item {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .task-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .task-description {
      font-weight: 500;
      flex: 1;
    }

    .task-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .task-info {
      display: flex;
      gap: 8px;
    }

    .task-notes {
      margin-top: 8px;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comment-item {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .comment-author {
      font-weight: 500;
      color: #1976d2;
    }

    .comment-date {
      color: #666;
    }

    .comment-content {
      white-space: pre-line;
      line-height: 1.5;
    }

    .comment-content ::ng-deep {
      p {
        margin: 8px 0;
      }
      strong {
        color: #333;
      }
      ul {
        margin: 8px 0;
        padding-left: 20px;
      }
      li {
        margin: 4px 0;
      }
    }

    .purchase-requests-section {
      padding: 20px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .request-card {
      margin-bottom: 16px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-left: 8px;
    }

    .status-pending {
      background-color: #fff3e0;
      color: #e65100;
    }

    .status-approved {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-ordered {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-received {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .status-rejected {
      background-color: #ffebee;
      color: #c62828;
    }

    .request-details {
      margin-top: 16px;
      font-size: 14px;
    }

    .no-requests {
      text-align: center;
      color: #666;
      padding: 40px;
    }
  `]
})
export class WorkOrderDetailsComponent implements OnInit {
  @Input() workOrder: WorkOrder | null = null;
  equipment: Equipment | null = null;
  assignedTechnician: User | null = null;
  isTechnician: boolean = false;

  constructor(
    private workOrderService: WorkOrderService,
    private workOrderActionsService: WorkOrderActionsService,
    private authService: AuthService,
    private mockDataService: MockDataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.isTechnician = this.authService.getCurrentUser()?.role === 'technician';
  }

  ngOnInit() {
    if (this.workOrder) {
      // Load equipment details
      this.mockDataService.getEquipmentById(this.workOrder.equipmentId).subscribe(
        equipment => this.equipment = equipment || null
      );

      // Load technician details
      this.authService.getUserById(this.workOrder.assignedTechnicianId).subscribe(
        user => this.assignedTechnician = user || null
      );
    }
  }

  getTypeIcon(type: string): string {
    return type === 'corrective' ? 'build' : 'schedule';
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

  getTaskStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'in_progress': 'En cours',
      'completed': 'Terminé'
    };
    return labels[status] || status;
  }

  getPurchaseRequestStatusLabel(status: PurchaseRequestStatus): string {
    const labels: Record<PurchaseRequestStatus, string> = {
      'pending': 'En attente',
      'approved': 'Approuvé',
      'ordered': 'Commandé',
      'received': 'Reçu',
      'rejected': 'Rejeté'
    };
    return labels[status] || status;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
  }

  getTotalPartsCost(): number {
    return this.workOrder?.parts.reduce((total, part) => total + part.totalCost, 0) || 0;
  }

  get sortedComments() {
    return [...(this.workOrder?.comments || [])].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  canCancel(): boolean {
    return this.workOrder?.status !== 'completed' && 
           this.workOrder?.status !== 'cancelled';
  }

  canStart(): boolean {
    return this.workOrder?.status === 'planned';
  }

  canComplete(): boolean {
    return this.workOrder?.status === 'in_progress';
  }

  canShowActionButtons(): boolean {
    if (!this.workOrder) return false;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    // Only show action buttons if:
    // 1. User is a technician AND this work order is assigned to them
    // 2. User is a maintenance chief (they can act on any work order)
    if (currentUser.role === 'technician') {
      return this.workOrder.assignedTechnicianId === currentUser.id;
    }
    
    return currentUser.role === 'maintenance_chief';
  }

  cancelWorkOrder() {
    if (!this.workOrder) return;
    
    this.workOrderActionsService.cancelWorkOrder(this.workOrder).subscribe({
      next: (updatedWorkOrder: WorkOrder) => {
        this.workOrder = updatedWorkOrder;
        this.snackBar.open('Bon de travail annulé avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error: Error) => {
        this.snackBar.open('Erreur lors de l\'annulation du bon de travail', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  startWorkOrder() {
    if (!this.workOrder) return;

    // Ouvrir d'abord le dialogue de planification
    const planningDialog = this.dialog.open(WorkOrderPlanningDialogComponent, {
      width: '600px',
      data: { workOrder: this.workOrder }
    });

    planningDialog.afterClosed().subscribe(tasks => {
      if (tasks) {
        // Si des tâches ont été définies, les enregistrer d'abord
        this.workOrderActionsService.planWorkOrder(this.workOrder!, tasks).subscribe({
          next: (updatedWorkOrder) => {
            this.workOrder = updatedWorkOrder;
            // Puis démarrer le bon de travail
            this.workOrderActionsService.startWorkOrder(updatedWorkOrder).subscribe({
              next: (startedWorkOrder) => {
                this.workOrder = startedWorkOrder;
                this.snackBar.open('Bon de travail démarré avec succès', 'Fermer', {
                  duration: 3000
                });
              },
              error: (error) => {
                this.snackBar.open('Erreur lors du démarrage du bon de travail', 'Fermer', {
                  duration: 3000
                });
              }
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la planification des tâches', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  completeWorkOrder() {
    if (!this.workOrder) return;
    
    this.workOrderActionsService.completeWorkOrder(this.workOrder).subscribe({
      next: (updatedWorkOrder: WorkOrder) => {
        this.workOrder = updatedWorkOrder;
        this.snackBar.open('Bon de travail terminé avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error: Error) => {
        this.snackBar.open('Erreur lors de la finalisation du bon de travail', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  completeTask(taskId: number) {
    if (!this.workOrder) return;
    
    this.workOrderActionsService.completeTask(this.workOrder, taskId).subscribe({
      next: (updatedWorkOrder) => {
        this.workOrder = updatedWorkOrder;
        this.snackBar.open('Tâche terminée avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        this.snackBar.open('Erreur lors de la finalisation de la tâche', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  openPurchaseRequestDialog() {
    const dialogRef = this.dialog.open(PurchaseRequestDialogComponent, {
      width: '600px',
      data: { workOrderId: this.workOrder?.id }
    });

    dialogRef.afterClosed().subscribe((request) => {
      if (request) {
        this.workOrderActionsService.addPurchaseRequest(this.workOrder!, request).subscribe({
          next: (updatedWorkOrder) => {
            this.workOrder = updatedWorkOrder;
            this.snackBar.open('Demande d\'achat ajoutée avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de l\'ajout de la demande d\'achat', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  updatePurchaseRequestStatus(request: PurchaseRequest, newStatus: PurchaseRequestStatus) {
    if (!this.workOrder) return;
    
    const updatedRequest: PurchaseRequest = {
      ...request,
      status: newStatus,
      updatedAt: new Date()
    };

    this.workOrderActionsService.updatePurchaseRequestStatus(this.workOrder, updatedRequest, newStatus).subscribe({
      next: (updatedWorkOrder) => {
        this.workOrder = updatedWorkOrder;
        this.snackBar.open('Statut de la demande d\'achat mis à jour', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', {
          duration: 3000
        });
      }
    });
  }
}
