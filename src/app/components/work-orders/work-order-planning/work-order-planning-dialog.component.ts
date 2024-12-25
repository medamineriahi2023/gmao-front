import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrder, WorkOrderTask } from '../../../models/work-order.model';

@Component({
  selector: 'app-work-order-planning-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Planification des tâches</h2>
    <mat-dialog-content>
      <div class="tasks-list">
        <div *ngFor="let task of tasks; let i = index" class="task-item">
          <mat-form-field class="task-description">
            <mat-label>Description de la tâche</mat-label>
            <input matInput [(ngModel)]="task.description" required>
          </mat-form-field>
          
          <mat-form-field class="task-duration">
            <mat-label>Durée estimée (minutes)</mat-label>
            <input matInput type="number" [(ngModel)]="task.estimatedDuration" required min="1">
          </mat-form-field>

          <button mat-icon-button color="warn" (click)="removeTask(i)" *ngIf="tasks.length > 1">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <button mat-button color="primary" (click)="addTask()">
        <mat-icon>add</mat-icon>
        Ajouter une tâche
      </button>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="primary" (click)="saveTasks()" [disabled]="!isValid()">
        Enregistrer
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    }

    .task-item {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .task-description {
      flex: 1;
    }

    .task-duration {
      width: 150px;
    }
  `]
})
export class WorkOrderPlanningDialogComponent {
  tasks: WorkOrderTask[] = [];
  taskForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<WorkOrderPlanningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { workOrder: WorkOrder }
  ) {
    // Initialiser avec les tâches existantes ou une tâche vide
    this.tasks = data.workOrder.tasks.length > 0 
      ? [...data.workOrder.tasks]
      : [this.createEmptyTask()];
    this.taskForm = new FormGroup({
      description: new FormControl(''),
      estimatedDuration: new FormControl(0)
    });
  }

  createEmptyTask(): WorkOrderTask {
    return {
      id: this.tasks.length + 1,
      description: this.taskForm.get('description')?.value || '',
      status: 'pending',
      estimatedDuration: this.taskForm.get('estimatedDuration')?.value || 0,
      category: 'inspection',
      requiredSkills: [],
      safetyInstructions: [],
      technicianNotes: ''
    };
  }

  addTask() {
    this.tasks.push(this.createEmptyTask());
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }

  isValid(): boolean {
    return this.tasks.every(task => 
      task.description.trim() !== '' && 
      task.estimatedDuration > 0
    );
  }

  saveTasks() {
    this.dialogRef.close(this.tasks);
  }
}
