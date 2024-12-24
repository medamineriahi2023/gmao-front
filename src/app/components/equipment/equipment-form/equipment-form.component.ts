import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Equipment } from '../../../models/equipment.model';

@Component({
  selector: 'app-equipment-form',
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
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="equipment-form">
      <div class="form-section">
        <h2>Informations générales</h2>
        <mat-form-field appearance="outline">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Numéro de série</mat-label>
          <input matInput formControlName="serialNumber" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <input matInput formControlName="type" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="Fonctionnel">Fonctionnel</mat-option>
            <mat-option value="En maintenance">En maintenance</mat-option>
            <mat-option value="À remplacer">À remplacer</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="form-section">
        <h2>Localisation</h2>
        <div formGroupName="location">
          <mat-form-field appearance="outline">
            <mat-label>Site</mat-label>
            <input matInput formControlName="site" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Bâtiment</mat-label>
            <input matInput formControlName="building" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Département</mat-label>
            <input matInput formControlName="department" required>
          </mat-form-field>
        </div>
      </div>

      <div class="form-section">
        <h2>Catégorie</h2>
        <div formGroupName="category">
          <mat-form-field appearance="outline">
            <mat-label>Famille</mat-label>
            <mat-select formControlName="family" required>
              <mat-option value="Véhicules">Véhicules</mat-option>
              <mat-option value="Matériel">Matériel</mat-option>
              <mat-option value="Bâtiments">Bâtiments</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Sous-famille</mat-label>
            <input matInput formControlName="subFamily" required>
          </mat-form-field>
        </div>
      </div>

      <div class="form-actions">
        <button mat-button type="button" (click)="onCancel.emit()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          {{equipment ? 'Modifier' : 'Ajouter'}}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .equipment-form {
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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
    }
  `]
})
export class EquipmentFormComponent {
  @Input() set equipment(value: Equipment | null) {
    if (value) {
      this.form.patchValue(value);
    }
  }
  @Output() onSave = new EventEmitter<Partial<Equipment>>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      serialNumber: ['', Validators.required],
      status: ['Fonctionnel', Validators.required],
      location: this.fb.group({
        site: ['', Validators.required],
        building: ['', Validators.required],
        department: ['', Validators.required]
      }),
      category: this.fb.group({
        family: ['', Validators.required],
        subFamily: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
    }
  }
}
