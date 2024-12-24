import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Equipment, MaintenanceRecord } from '../../../models/equipment.model';

@Component({
  selector: 'app-maintenance-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Planifier une maintenance</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="maintenance-form">
        <mat-form-field appearance="outline">
          <mat-label>Type de maintenance</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="Préventive">Préventive</mat-option>
            <mat-option value="Curative">Curative</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date prévue</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" required></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Coût estimé (€)</mat-label>
          <input matInput type="number" formControlName="cost" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Technicien assigné</mat-label>
          <input matInput formControlName="technician" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="!form.valid"
              (click)="onSubmit()">
        Planifier
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .maintenance-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class MaintenanceDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MaintenanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipment: Equipment }
  ) {
    this.form = this.fb.group({
      type: ['Préventive', Validators.required],
      date: [new Date(), Validators.required],
      description: ['', Validators.required],
      cost: [0, [Validators.required, Validators.min(0)]],
      technician: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const maintenance: MaintenanceRecord = {
        id: Date.now(),
        ...this.form.value
      };
      this.dialogRef.close(maintenance);
    }
  }
}
