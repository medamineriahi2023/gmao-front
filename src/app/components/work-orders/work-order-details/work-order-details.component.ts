import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { WorkOrder } from '../../../models/work-order.model';

@Component({
  selector: 'app-work-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule
  ],
  template: `
    <div class="details-container" *ngIf="workOrder">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar [ngClass]="'type-' + workOrder.type">
            {{getTypeIcon(workOrder.type)}}
          </mat-icon>
          <mat-card-title>
            Bon de travail #{{workOrder.id}}
            <mat-chip-listbox class="status-chips">
              <mat-chip [ngClass]="'status-' + workOrder.status">
                {{getStatusLabel(workOrder.status)}}
              </mat-chip>
              <mat-chip [ngClass]="'priority-' + workOrder.priority">
                {{getPriorityLabel(workOrder.priority)}}
              </mat-chip>
            </mat-chip-listbox>
          </mat-card-title>
          <mat-card-subtitle>
            Créé le {{workOrder.createdAt | date:'dd/MM/yyyy'}}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="info-section">
            <h3>Description</h3>
            <p>{{workOrder.description}}</p>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Planification</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Date de début prévue</span>
                <span class="value">{{workOrder.plannedStartDate | date:'dd/MM/yyyy'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Date de fin prévue</span>
                <span class="value">{{workOrder.plannedEndDate | date:'dd/MM/yyyy'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Date de début réelle</span>
                <span class="value">{{workOrder.actualStartDate | date:'dd/MM/yyyy' || 'Non commencé'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Date de fin réelle</span>
                <span class="value">{{workOrder.actualEndDate | date:'dd/MM/yyyy' || 'Non terminé'}}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Coûts</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Coût estimé</span>
                <span class="value">{{workOrder.estimatedCost | currency:'EUR'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Coût réel</span>
                <span class="value">{{workOrder.actualCost | currency:'EUR' || 'Non défini'}}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Techniciens assignés</h3>
            <mat-chip-listbox>
              <mat-chip *ngFor="let tech of workOrder.assignedTechnicians">
                {{tech}}
              </mat-chip>
            </mat-chip-listbox>
          </div>

          <mat-divider></mat-divider>

          <mat-tab-group>
            <mat-tab label="Tâches">
              <div class="tab-content">
                <table class="task-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Statut</th>
                      <th>Durée estimée</th>
                      <th>Durée réelle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let task of workOrder.tasks">
                      <td>{{task.description}}</td>
                      <td>
                        <mat-chip [ngClass]="'status-' + task.status">
                          {{getTaskStatusLabel(task.status)}}
                        </mat-chip>
                      </td>
                      <td>{{formatDuration(task.estimatedDuration)}}</td>
                      <td>{{task.actualDuration ? formatDuration(task.actualDuration) : '-'}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </mat-tab>

            <mat-tab label="Pièces">
              <div class="tab-content">
                <table class="parts-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Quantité</th>
                      <th>Coût unitaire</th>
                      <th>Coût total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let part of workOrder.parts">
                      <td>{{part.name}}</td>
                      <td>{{part.quantity}}</td>
                      <td>{{part.unitCost | currency:'EUR'}}</td>
                      <td>{{part.totalCost | currency:'EUR'}}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3">Total</td>
                      <td>{{getTotalPartsCost() | currency:'EUR'}}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </mat-tab>

            <mat-tab label="Commentaires">
              <div class="tab-content comments-list">
                <div *ngFor="let comment of sortedComments" class="comment">
                  <div class="comment-header">
                    <span class="comment-author">{{comment.author}}</span>
                    <span class="comment-date">{{comment.createdAt | date:'dd/MM/yyyy HH:mm'}}</span>
                  </div>
                  <div class="comment-content">{{comment.content}}</div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button color="warn" *ngIf="canCancel()" (click)="cancelWorkOrder()">
            Annuler le bon de travail
          </button>
          <button mat-button color="primary" *ngIf="canStart()" (click)="startWorkOrder()">
            Démarrer le travail
          </button>
          <button mat-raised-button color="primary" *ngIf="canComplete()" (click)="completeWorkOrder()">
            Terminer le travail
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .details-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .status-chips {
      margin-left: 16px;
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

    .type-corrective { color: #f44336; }
    .type-preventive { color: #2196f3; }

    .status-draft { background: #e0e0e0; }
    .status-planned { background: #bbdefb; }
    .status-in_progress { background: #fff3e0; }
    .status-completed { background: #c8e6c9; }
    .status-cancelled { background: #ffcdd2; }

    .priority-low { background: #e8f5e9; color: #2e7d32; }
    .priority-medium { background: #fff3e0; color: #f57c00; }
    .priority-high { background: #ffebee; color: #c62828; }
    .priority-urgent { background: #ff5252; color: white; }

    .tab-content {
      padding: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    th {
      font-weight: 500;
      color: #666;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comment {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .comment-author {
      font-weight: 500;
    }

    .comment-date {
      color: #666;
      font-size: 12px;
    }
  `]
})
export class WorkOrderDetailsComponent {
  @Input() workOrder: WorkOrder | null = null;

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
      'pending': 'À faire',
      'in_progress': 'En cours',
      'completed': 'Terminé'
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

  cancelWorkOrder() {
    // TODO: Implement work order cancellation
  }

  startWorkOrder() {
    // TODO: Implement work order start
  }

  completeWorkOrder() {
    // TODO: Implement work order completion
  }
}
