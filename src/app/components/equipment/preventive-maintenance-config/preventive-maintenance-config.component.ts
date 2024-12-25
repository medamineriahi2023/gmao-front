import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Equipment, PreventiveMaintenance } from '../../../models/equipment.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-preventive-maintenance-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Configuration de la maintenance préventive</h2>
    <form [formGroup]="maintenanceForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Titre</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Fréquence</mat-label>
            <mat-select formControlName="frequency" required>
              <mat-option value="daily">Quotidienne</mat-option>
              <mat-option value="weekly">Hebdomadaire</mat-option>
              <mat-option value="monthly">Mensuelle</mat-option>
              <mat-option value="quarterly">Trimestrielle</mat-option>
              <mat-option value="biannual">Semestrielle</mat-option>
              <mat-option value="annual">Annuelle</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Technicien assigné</mat-label>
            <mat-select formControlName="assignedTechnicianId" required>
              <mat-option *ngFor="let tech of technicians" [value]="tech.id">
                {{tech.firstName}} {{tech.lastName}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div formArrayName="tasks" class="tasks-section">
          <h3>Tâches de maintenance</h3>
          <div *ngFor="let task of tasks.controls; let i=index" [formGroupName]="i" class="task-item">
            <mat-form-field appearance="outline" class="task-description">
              <mat-label>Description de la tâche</mat-label>
              <input matInput formControlName="description">
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="task-duration">
              <mat-label>Durée estimée (min)</mat-label>
              <input matInput type="number" formControlName="estimatedDuration">
            </mat-form-field>
            
            <button mat-icon-button color="warn" type="button" (click)="removeTask(i)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
          
          <button mat-stroked-button type="button" (click)="addTask()">
            <mat-icon>add</mat-icon> Ajouter une tâche
          </button>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!maintenanceForm.valid">
          Enregistrer
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-row {
      margin-bottom: 1rem;
    }
    .full-width {
      width: 100%;
    }
    .tasks-section {
      margin-top: 1.5rem;
    }
    .task-item {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }
    .task-description {
      flex: 3;
    }
    .task-duration {
      flex: 1;
    }
  `]
})
export class PreventiveMaintenanceConfigComponent {
  maintenanceForm: FormGroup;
  technicians: User[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PreventiveMaintenanceConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      equipment: Equipment,
      technicians: User[],
      maintenance?: PreventiveMaintenance
    }
  ) {
    this.technicians = data.technicians;
    this.initForm();
  }

  private initForm() {
    this.maintenanceForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      frequency: ['monthly', Validators.required],
      assignedTechnicianId: ['', Validators.required],
      tasks: this.fb.array([])
    });

    if (this.data.maintenance) {
      this.maintenanceForm.patchValue({
        title: this.data.maintenance.title,
        description: this.data.maintenance.description,
        frequency: this.data.maintenance.frequency,
        assignedTechnicianId: this.data.maintenance.assignedTechnicianId
      });

      this.data.maintenance.tasks.forEach(task => {
        this.addTask(task);
      });
    } else {
      this.addTask();
    }
  }

  get tasks() {
    return this.maintenanceForm.get('tasks') as any;
  }

  addTask(task?: { description: string; estimatedDuration: number }) {
    const taskGroup = this.fb.group({
      description: [task?.description || '', Validators.required],
      estimatedDuration: [task?.estimatedDuration || 30, [Validators.required, Validators.min(1)]]
    });
    this.tasks.push(taskGroup);
  }

  removeTask(index: number) {
    this.tasks.removeAt(index);
  }

  onSubmit() {
    if (this.maintenanceForm.valid) {
      const formValue = this.maintenanceForm.value;
      const maintenance: PreventiveMaintenance = {
        id: this.data.maintenance?.id || Date.now(),
        ...formValue,
        active: true,
        lastExecutionDate: this.data.maintenance?.lastExecutionDate,
        nextExecutionDate: this.calculateNextExecutionDate(formValue.frequency)
      };
      this.dialogRef.close(maintenance);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private calculateNextExecutionDate(frequency: string): Date {
    const date = new Date();
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'biannual':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'annual':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date;
  }
}
