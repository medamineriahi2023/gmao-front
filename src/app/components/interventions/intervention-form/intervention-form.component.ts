import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Intervention } from '../../../models/intervention.model';

@Component({
  selector: 'app-intervention-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="intervention-form">
      <div class="form-section">
        <h2>Informations générales</h2>
        
        <mat-form-field appearance="outline">
          <mat-label>Type d'intervention</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="curative">Curative</mat-option>
            <mat-option value="preventive">Préventive</mat-option>
            <mat-option value="conditional">Conditionnelle</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Priorité</mat-label>
          <mat-select formControlName="priority" required>
            <mat-option value="low">Basse</mat-option>
            <mat-option value="medium">Moyenne</mat-option>
            <mat-option value="high">Haute</mat-option>
            <mat-option value="critical">Critique</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" required></textarea>
        </mat-form-field>
      </div>

      <div class="form-section">
        <h2>Planification</h2>
        
        <div class="date-range">
          <mat-form-field appearance="outline">
            <mat-label>Date de début prévue</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="plannedStartDate">
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date de fin prévue</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="plannedEndDate">
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Techniciens assignés</mat-label>
          <mat-select formControlName="assignedTechnicians" multiple>
            <mat-option value="tech1">Jean Dupont</mat-option>
            <mat-option value="tech2">Marie Martin</mat-option>
            <mat-option value="tech3">Pierre Durant</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="form-actions">
        <button mat-button type="button" (click)="onCancel.emit()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          {{intervention ? 'Modifier' : 'Créer'}}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .intervention-form {
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
export class InterventionFormComponent {
  @Input() set intervention(value: Intervention | null) {
    if (value) {
      this.form.patchValue(value);
    }
  }
  
  @Output() onSave = new EventEmitter<Partial<Intervention>>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      type: ['curative', Validators.required],
      priority: ['medium', Validators.required],
      description: ['', Validators.required],
      plannedStartDate: [null],
      plannedEndDate: [null],
      assignedTechnicians: [[]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
    }
  }
}
