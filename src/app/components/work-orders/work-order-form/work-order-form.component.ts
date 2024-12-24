import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrder } from '../../../models/work-order.model';

@Component({
  selector: 'app-work-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="work-order-form">
      <div class="form-section">
        <h2>Informations générales</h2>
        
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="corrective">Correctif</mat-option>
            <mat-option value="preventive">Préventif</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" required></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Priorité</mat-label>
          <mat-select formControlName="priority" required>
            <mat-option value="low">Basse</mat-option>
            <mat-option value="medium">Moyenne</mat-option>
            <mat-option value="high">Haute</mat-option>
            <mat-option value="urgent">Urgente</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="form-section">
        <h2>Planification</h2>
        
        <div class="date-range">
          <mat-form-field appearance="outline">
            <mat-label>Date de début</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="plannedStartDate" required>
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date de fin</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="plannedEndDate" required>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Coût estimé</mat-label>
          <input matInput type="number" formControlName="estimatedCost" required>
          <span matSuffix>€</span>
        </mat-form-field>
      </div>

      <div class="form-actions">
        <button mat-button type="button" (click)="onCancel.emit()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          {{workOrder ? 'Modifier' : 'Créer'}}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .work-order-form {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h2 {
      margin-bottom: 16px;
      color: #333;
      font-size: 18px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .date-range {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
    }
  `]
})
export class WorkOrderFormComponent {
  @Input() set workOrder(value: WorkOrder | null) {
    if (value) {
      this.form.patchValue(value);
    }
  }
  
  @Output() onSave = new EventEmitter<Partial<WorkOrder>>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      type: ['corrective', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['medium', Validators.required],
      plannedStartDate: [null, Validators.required],
      plannedEndDate: [null, Validators.required],
      estimatedCost: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
    }
  }
}
