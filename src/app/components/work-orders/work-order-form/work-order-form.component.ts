import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Equipment } from '../../../models/equipment.model';
import { MockDataService } from '../../../services/mock-data.service';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  template: `
    <div class="work-order-form-container">
      <h2>{{ workOrder ? 'Modifier' : 'Créer' }} un bon de travail</h2>
      
      <form [formGroup]="workOrderForm" (ngSubmit)="onSubmit()">
        <!-- Équipement -->
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Équipement</mat-label>
          <mat-select formControlName="equipmentId" required>
            <mat-option *ngFor="let equipment of equipments" [value]="equipment.id">
              {{equipment.name}} - {{equipment.location}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Description du problème -->
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description du problème</mat-label>
          <textarea matInput formControlName="description" required rows="4"></textarea>
        </mat-form-field>

        <!-- Priorité -->
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Priorité</mat-label>
          <mat-select formControlName="priority" required>
            <mat-option value="low">Basse</mat-option>
            <mat-option value="medium">Moyenne</mat-option>
            <mat-option value="high">Haute</mat-option>
            <mat-option value="urgent">Urgente</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Technicien assigné -->
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Technicien assigné</mat-label>
          <mat-select formControlName="assignedTechnicianId" required>
            <mat-option *ngFor="let tech of technicians" [value]="tech.id">
              {{tech.firstName}} {{tech.lastName}} ({{tech.username}})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Date prévue -->
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Date prévue</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <!-- Boutons d'action -->
        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()">Annuler</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!workOrderForm.valid">
            {{ workOrder ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .work-order-form-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    h2 {
      margin-bottom: 20px;
      color: #333;
    }

    textarea {
      min-height: 100px;
    }
  `]
})
export class WorkOrderFormComponent implements OnInit {
  workOrderForm: FormGroup;
  technicians: User[] = [];
  equipments: Equipment[] = [];
  workOrder: any = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<WorkOrderFormComponent>,
    private authService: AuthService,
    private mockDataService: MockDataService
  ) {
    this.workOrderForm = this.fb.group({
      equipmentId: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['medium', Validators.required],
      assignedTechnicianId: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Charger les techniciens
    this.authService.getTechnicians().subscribe(techs => {
      this.technicians = techs;
    });

    // Charger les équipements
    this.mockDataService.getEquipments().subscribe(equipments => {
      this.equipments = equipments;
    });

    // Si modification d'un bon existant
    if (this.workOrder) {
      this.workOrderForm.patchValue({
        equipmentId: this.workOrder.equipmentId,
        description: this.workOrder.description,
        priority: this.workOrder.priority,
        assignedTechnicianId: this.workOrder.assignedTechnicianId,
        dueDate: this.workOrder.dueDate
      });
    }
  }

  onSubmit() {
    if (this.workOrderForm.valid) {
      this.dialogRef.close(this.workOrderForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
