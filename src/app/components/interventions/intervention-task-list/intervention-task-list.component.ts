import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InterventionTask } from '../../../models/intervention.model';

@Component({
  selector: 'app-intervention-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="task-list-container">
      <div class="header-actions">
        <button mat-raised-button color="primary" (click)="addTask()">
          <mat-icon>add</mat-icon>
          Ajouter une tâche
        </button>
      </div>

      <table mat-table [dataSource]="tasks" class="task-table">
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let task">{{task.description}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let task">
            <mat-chip [ngClass]="'status-' + task.status">
              {{getStatusLabel(task.status)}}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="duration">
          <th mat-header-cell *matHeaderCellDef>Durée</th>
          <td mat-cell *matCellDef="let task">
            <div class="duration-info">
              <span>{{formatDuration(task.estimatedDuration)}}</span>
              <mat-progress-bar 
                mode="determinate"
                [value]="getProgressValue(task)"
                [color]="getProgressColor(task)">
              </mat-progress-bar>
              <span *ngIf="task.actualDuration">
                ({{formatDuration(task.actualDuration)}})
              </span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let task">
            <button mat-icon-button color="primary" (click)="startTask(task)"
                    *ngIf="task.status === 'pending'">
              <mat-icon>play_arrow</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="pauseTask(task)"
                    *ngIf="task.status === 'in_progress'">
              <mat-icon>pause</mat-icon>
            </button>
            <button mat-icon-button color="primary" (click)="completeTask(task)"
                    *ngIf="task.status === 'in_progress'">
              <mat-icon>check</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteTask(task)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 16px;
    }

    .header-actions {
      margin-bottom: 16px;
    }

    .task-table {
      width: 100%;
    }

    .duration-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-progress-bar {
      width: 100px;
    }

    .status-pending { background: #e0e0e0; }
    .status-in_progress { background: #fff3e0; }
    .status-completed { background: #c8e6c9; }
  `]
})
export class InterventionTaskListComponent {
  @Input() tasks: InterventionTask[] = [];
  @Output() taskUpdated = new EventEmitter<InterventionTask>();

  displayedColumns = ['description', 'status', 'duration', 'actions'];

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'À faire',
      'in_progress': 'En cours',
      'completed': 'Terminée'
    };
    return labels[status] || status;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
  }

  getProgressValue(task: InterventionTask): number {
    if (!task.actualDuration) return 0;
    return (task.actualDuration / task.estimatedDuration) * 100;
  }

  getProgressColor(task: InterventionTask): string {
    if (!task.actualDuration) return 'primary';
    const ratio = task.actualDuration / task.estimatedDuration;
    return ratio <= 1 ? 'primary' : 'warn';
  }

  addTask() {
    // TODO: Implement task addition dialog
  }

  startTask(task: InterventionTask) {
    const updatedTask = { ...task, status: 'in_progress' as const };
    this.taskUpdated.emit(updatedTask);
  }

  pauseTask(task: InterventionTask) {
    const updatedTask = { ...task, status: 'pending' as const };
    this.taskUpdated.emit(updatedTask);
  }

  completeTask(task: InterventionTask) {
    const updatedTask = { ...task, status: 'completed' as const };
    this.taskUpdated.emit(updatedTask);
  }

  deleteTask(task: InterventionTask) {
    // TODO: Implement task deletion with confirmation
  }
}
