import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Contract, ContractType } from '../../../models/contract.model';

@Component({
  selector: 'app-contract-form',
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
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="contract-form">
      <div class="form-section">
        <h2>Informations générales</h2>
        
        <mat-form-field appearance="outline">
          <mat-label>Référence</mat-label>
          <input matInput formControlName="reference" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="maintenance">Maintenance</mat-option>
            <mat-option value="inspection">Inspection</mat-option>
            <mat-option value="support">Support</mat-option>
            <mat-option value="service">Service</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4"></textarea>
        </mat-form-field>
      </div>

      <div class="form-section">
        <h2>Fournisseur</h2>
        
        <div formGroupName="provider">
          <mat-form-field appearance="outline">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Contact</mat-label>
            <input matInput formControlName="contact" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required type="email">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Téléphone</mat-label>
            <input matInput formControlName="phone" required>
          </mat-form-field>
        </div>
      </div>

      <div class="form-section">
        <h2>Durée et coût</h2>
        
        <div class="date-range">
          <mat-form-field appearance="outline">
            <mat-label>Date de début</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate" required>
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date de fin</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDate" required>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Valeur du contrat (€)</mat-label>
          <input matInput type="number" formControlName="value" required>
        </mat-form-field>
      </div>

      <div class="form-actions">
        <button mat-button type="button" (click)="onCancel.emit()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          {{contract ? 'Modifier' : 'Créer'}}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .contract-form {
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
export class ContractFormComponent {
  @Input() set contract(value: Contract | null) {
    if (value) {
      this.form.patchValue(value);
    }
  }
  
  @Output() onSave = new EventEmitter<Partial<Contract>>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      reference: ['', Validators.required],
      title: ['', Validators.required],
      type: ['maintenance', Validators.required],
      description: [''],
      provider: this.fb.group({
        name: ['', Validators.required],
        contact: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required]
      }),
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      value: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
    }
  }
}
