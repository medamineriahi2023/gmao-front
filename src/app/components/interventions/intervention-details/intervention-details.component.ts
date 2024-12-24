import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { Intervention } from '../../../models/intervention.model';
import { InterventionTaskListComponent } from '../intervention-task-list/intervention-task-list.component';
import { InterventionPartsListComponent } from '../intervention-parts-list/intervention-parts-list.component';
import { InterventionCommentsComponent } from '../intervention-comments/intervention-comments.component';

@Component({
  selector: 'app-intervention-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    InterventionTaskListComponent,
    InterventionPartsListComponent,
    InterventionCommentsComponent
  ],
  template: `
    <div class="details-container" *ngIf="intervention">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar [ngClass]="'type-' + intervention.type">
            {{getTypeIcon(intervention.type)}}
          </mat-icon>
          <mat-card-title>
            Intervention #{{intervention.id}}
            <mat-chip-listbox class="status-chips">
              <mat-chip [ngClass]="'status-' + intervention.status">
                {{getStatusLabel(intervention.status)}}
              </mat-chip>
              <mat-chip [ngClass]="'priority-' + intervention.priority">
                {{getPriorityLabel(intervention.priority)}}
              </mat-chip>
            </mat-chip-listbox>
          </mat-card-title>
          <mat-card-subtitle>
            Signalée le {{intervention.reportedAt | date:'dd/MM/yyyy'}}
            par {{intervention.reportedBy}}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="info-section">
            <h3>Description</h3>
            <p>{{intervention.description}}</p>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Planification</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Date de début prévue</span>
                <span class="value">{{intervention.plannedStartDate | date:'dd/MM/yyyy'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Date de fin prévue</span>
                <span class="value">{{intervention.plannedEndDate | date:'dd/MM/yyyy'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Date de début réelle</span>
                <span class="value">{{intervention.actualStartDate | date:'dd/MM/yyyy' || 'Non commencée'}}</span>
              </div>
              <div class="info-item">
                <span class="label">Date de fin réelle</span>
                <span class="value">{{intervention.actualEndDate | date:'dd/MM/yyyy' || 'Non terminée'}}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="info-section">
            <h3>Techniciens assignés</h3>
            <mat-chip-listbox>
              <mat-chip *ngFor="let tech of intervention.assignedTechnicians">
                {{tech}}
              </mat-chip>
            </mat-chip-listbox>
          </div>

          <mat-divider></mat-divider>

          <mat-tab-group>
            <mat-tab label="Tâches">
              <app-intervention-task-list
                [tasks]="intervention.tasks"
                (taskUpdated)="onTaskUpdated($event)">
              </app-intervention-task-list>
            </mat-tab>

            <mat-tab label="Pièces">
              <app-intervention-parts-list
                [parts]="intervention.parts"
                (partUpdated)="onPartUpdated($event)">
              </app-intervention-parts-list>
            </mat-tab>

            <mat-tab label="Commentaires">
              <app-intervention-comments
                [comments]="intervention.comments"
                (commentAdded)="onCommentAdded($event)">
              </app-intervention-comments>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button color="warn" *ngIf="canCancel()" (click)="cancelIntervention()">
            Annuler l'intervention
          </button>
          <button mat-button color="primary" *ngIf="canStart()" (click)="startIntervention()">
            Démarrer l'intervention
          </button>
          <button mat-raised-button color="primary" *ngIf="canComplete()" (click)="completeIntervention()">
            Terminer l'intervention
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

    .type-curative { color: #f44336; }
    .type-preventive { color: #2196f3; }
    .type-conditional { color: #ff9800; }

    .status-draft { background: #e0e0e0; }
    .status-pending { background: #bbdefb; }
    .status-approved { background: #c8e6c9; }
    .status-in_progress { background: #fff3e0; }
    .status-completed { background: #c8e6c9; }
    .status-rejected { background: #ffcdd2; }

    .priority-low { background: #e8f5e9; color: #2e7d32; }
    .priority-medium { background: #fff3e0; color: #f57c00; }
    .priority-high { background: #ffebee; color: #c62828; }
    .priority-critical { background: #ff5252; color: white; }

    mat-tab-group {
      margin-top: 24px;
    }
  `]
})
export class InterventionDetailsComponent {
  @Input() intervention: Intervention | null = null;

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'curative': 'build',
      'preventive': 'schedule',
      'conditional': 'sensors'
    };
    return icons[type] || 'build';
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

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'low': 'Basse',
      'medium': 'Moyenne',
      'high': 'Haute',
      'critical': 'Critique'
    };
    return labels[priority] || priority;
  }

  canCancel(): boolean {
    return this.intervention?.status !== 'completed' && 
           this.intervention?.status !== 'rejected';
  }

  canStart(): boolean {
    return this.intervention?.status === 'approved';
  }

  canComplete(): boolean {
    return this.intervention?.status === 'in_progress';
  }

  cancelIntervention() {
    // TODO: Implement intervention cancellation
  }

  startIntervention() {
    // TODO: Implement intervention start
  }

  completeIntervention() {
    // TODO: Implement intervention completion
  }

  onTaskUpdated(task: any) {
    // TODO: Implement task update handling
  }

  onPartUpdated(part: any) {
    // TODO: Implement part update handling
  }

  onCommentAdded(comment: any) {
    // TODO: Implement comment addition handling
  }
}
