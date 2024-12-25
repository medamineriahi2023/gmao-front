import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Equipment, PreventiveMaintenance } from '../../../models/equipment.model';

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
    MatButtonModule,
    MatIconModule
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

      <div class="form-section">
        <h2>Maintenance préventive</h2>
        <div formArrayName="preventiveMaintenance">
          <div *ngFor="let maintenance of preventiveMaintenances.controls; let i=index" 
               [formGroupName]="i" 
               class="maintenance-item">
            <mat-form-field appearance="outline">
              <mat-label>Titre</mat-label>
              <input matInput formControlName="title" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="2"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fréquence</mat-label>
              <mat-select formControlName="frequency" required>
                <mat-option value="quotidienne">Quotidienne</mat-option>
                <mat-option value="hebdomadaire">Hebdomadaire</mat-option>
                <mat-option value="mensuelle">Mensuelle</mat-option>
                <mat-option value="trimestrielle">Trimestrielle</mat-option>
                <mat-option value="semestrielle">Semestrielle</mat-option>
                <mat-option value="annuelle">Annuelle</mat-option>
              </mat-select>
            </mat-form-field>

            <div formArrayName="tasks">
              <h4>Tâches</h4>
              <div *ngFor="let task of getMaintenanceTasks(i).controls; let j=index" 
                   [formGroupName]="j" 
                   class="task-item">
                <mat-form-field appearance="outline" class="task-description">
                  <mat-label>Description</mat-label>
                  <input matInput formControlName="description" required>
                </mat-form-field>

                <mat-form-field appearance="outline" class="task-duration">
                  <mat-label>Durée (min)</mat-label>
                  <input matInput type="number" formControlName="estimatedDuration" required>
                </mat-form-field>

                <button mat-icon-button color="warn" type="button" (click)="removeTask(i, j)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>

              <button mat-stroked-button type="button" (click)="addTask(i)">
                <mat-icon>add</mat-icon> Ajouter une tâche
              </button>
            </div>

            <div class="maintenance-actions">
              <button mat-icon-button color="warn" type="button" (click)="removeMaintenance(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <button mat-stroked-button type="button" (click)="addMaintenance()">
            <mat-icon>add</mat-icon> Ajouter une maintenance préventive
          </button>
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

    .maintenance-item {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .task-item {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 8px;
    }

    .task-description {
      flex: 3;
    }

    .task-duration {
      flex: 1;
    }

    .maintenance-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
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
      }),
      preventiveMaintenance: this.fb.array([])
    });
  }

  get preventiveMaintenances() {
    return this.form.get('preventiveMaintenance') as FormArray;
  }

  getMaintenanceTasks(maintenanceIndex: number): FormArray {
    return this.preventiveMaintenances.at(maintenanceIndex).get('tasks') as FormArray;
  }

  addMaintenance() {
    const maintenanceGroup = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      frequency: ['mensuelle', Validators.required],
      tasks: this.fb.array([])
    });

    this.preventiveMaintenances.push(maintenanceGroup);
    this.addTask(this.preventiveMaintenances.length - 1);
  }

  addTask(maintenanceIndex: number) {
    const tasks = this.getMaintenanceTasks(maintenanceIndex);
    tasks.push(this.fb.group({
      description: ['', Validators.required],
      estimatedDuration: [30, [Validators.required, Validators.min(1)]]
    }));
  }

  removeTask(maintenanceIndex: number, taskIndex: number) {
    const tasks = this.getMaintenanceTasks(maintenanceIndex);
    tasks.removeAt(taskIndex);
  }

  removeMaintenance(index: number) {
    this.preventiveMaintenances.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
    }
  }
}
