import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { Intervention } from '../../../models/intervention.model';

export const MY_FORMATS = {
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
    MatChipsModule,
    MatListModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="intervention-form">
      <div class="form-section">
        <h2>Informations générales</h2>
        
        <mat-form-field appearance="outline">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

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

        <mat-form-field appearance="outline">
          <mat-label>État</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="planned">Planifié</mat-option>
            <mat-option value="in_progress">En cours</mat-option>
            <mat-option value="completed">Terminé</mat-option>
          </mat-select>
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

      <div class="form-section">
        <h2>Tâches planifiées</h2>
        
        <div formArrayName="tasks" class="tasks-list">
          <div *ngFor="let task of tasks.controls; let i=index" [formGroupName]="i" class="task-item">
            <mat-form-field appearance="outline" class="task-description">
              <mat-label>Description de la tâche</mat-label>
              <textarea matInput formControlName="description" rows="2" required></textarea>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Durée estimée (heures)</mat-label>
              <input matInput type="number" formControlName="estimatedDuration" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priorité</mat-label>
              <mat-select formControlName="priority" required>
                <mat-option value="low">Basse</mat-option>
                <mat-option value="medium">Moyenne</mat-option>
                <mat-option value="high">Haute</mat-option>
              </mat-select>
            </mat-form-field>
            
            <button mat-icon-button color="warn" type="button" (click)="removeTask(i)" 
                    matTooltip="Supprimer la tâche">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
        
        <button mat-stroked-button type="button" (click)="addTask()" class="add-task-btn">
          <mat-icon>add</mat-icon> Ajouter une tâche
        </button>
      </div>

      <div class="form-section">
        <h2>Bon de travail</h2>
        
        <div formArrayName="workOrderTasks" class="tasks-list">
          <div *ngFor="let task of workOrderTasks.controls; let i=index" [formGroupName]="i" class="task-item">
            <mat-form-field appearance="outline">
              <mat-label>Description du travail effectué</mat-label>
              <textarea matInput formControlName="description" rows="2" required></textarea>
            </mat-form-field>
            
            <div class="task-details">
              <mat-form-field appearance="outline">
                <mat-label>Temps passé (heures)</mat-label>
                <input matInput type="number" formControlName="timeSpent" required>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>État</mat-label>
                <mat-select formControlName="status" required>
                  <mat-option value="planned">Planifié</mat-option>
                  <mat-option value="in_progress">En cours</mat-option>
                  <mat-option value="completed">Terminé</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="parts-used" formArrayName="partsUsed">
              <h3>Pièces utilisées</h3>
              <div *ngFor="let part of getPartsUsed(i).controls; let j=index" [formGroupName]="j" class="part-item">
                <mat-form-field appearance="outline">
                  <mat-label>Nom de la pièce</mat-label>
                  <input matInput formControlName="name" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Quantité</mat-label>
                  <input matInput type="number" formControlName="quantity" required>
                </mat-form-field>

                <button mat-icon-button color="warn" type="button" (click)="removePart(i, j)" 
                        matTooltip="Supprimer la pièce">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
              
              <button mat-stroked-button type="button" (click)="addPart(i)" class="add-part-btn">
                <mat-icon>add</mat-icon> Ajouter une pièce
              </button>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Observations</mat-label>
              <textarea matInput formControlName="observations" rows="2"></textarea>
            </mat-form-field>
            
            <button mat-icon-button color="warn" type="button" (click)="removeWorkOrderTask(i)" 
                    matTooltip="Supprimer la tâche">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
        
        <button mat-stroked-button type="button" (click)="addWorkOrderTask()" class="add-task-btn">
          <mat-icon>add</mat-icon> Ajouter une tâche au bon de travail
        </button>
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

    .tasks-list {
      margin-bottom: 16px;
    }

    .task-item {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      align-items: start;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .task-description {
      grid-column: 1;
    }

    .add-task-btn {
      margin-bottom: 24px;
    }

    .task-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .parts-used {
      background: #f8f8f8;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .parts-used h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #666;
    }

    .part-item {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 16px;
      margin-bottom: 8px;
    }

    .add-part-btn {
      margin-bottom: 16px;
    }
  `]
})
export class InterventionFormComponent {
  @Input() set intervention(value: Intervention | null) {
    if (value) {
      this.form.patchValue(value);
      if (value.tasks) {
        value.tasks.forEach(task => this.addTask(task));
      }
      if (value.workOrderTasks) {
        value.workOrderTasks.forEach((task : any) => this.addWorkOrderTask(task));
      }
    }
  }
  
  @Output() onSave = new EventEmitter<Partial<Intervention>>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      type: ['curative', Validators.required],
      priority: ['medium', Validators.required],
      description: ['', Validators.required],
      plannedStartDate: [null],
      plannedEndDate: [null],
      assignedTechnicians: [[]],
      status: ['planned', Validators.required],
      tasks: this.fb.array([]),
      workOrderTasks: this.fb.array([])
    });
  }

  get tasks() {
    return this.form.get('tasks') as FormArray;
  }

  addTask(task: any = null) {
    const taskForm = this.fb.group({
      description: [task?.description || '', Validators.required],
      estimatedDuration: [task?.estimatedDuration || '', [Validators.required, Validators.min(0)]],
      priority: [task?.priority || 'medium', Validators.required]
    });
    this.tasks.push(taskForm);
  }

  removeTask(index: number) {
    this.tasks.removeAt(index);
  }

  get workOrderTasks() {
    return this.form.get('workOrderTasks') as FormArray;
  }

  addWorkOrderTask(task: any = null) {
    const taskForm = this.fb.group({
      description: [task?.description || '', Validators.required],
      timeSpent: [task?.timeSpent || '', [Validators.required, Validators.min(0)]],
      status: [task?.status || 'planned', Validators.required],
      observations: [task?.observations || ''],
      partsUsed: this.fb.array(task?.partsUsed?.map((part: any) => this.createPartFormGroup(part)) || [])
    });
    this.workOrderTasks.push(taskForm);
  }

  removeWorkOrderTask(index: number) {
    this.workOrderTasks.removeAt(index);
  }

  createPartFormGroup(part: any = null) {
    return this.fb.group({
      name: [part?.name || '', Validators.required],
      quantity: [part?.quantity || '', [Validators.required, Validators.min(1)]]
    });
  }

  getPartsUsed(taskIndex: number): FormArray {
    return this.workOrderTasks.at(taskIndex).get('partsUsed') as FormArray;
  }

  addPart(taskIndex: number, part: any = null) {
    const partsArray = this.getPartsUsed(taskIndex);
    partsArray.push(this.createPartFormGroup(part));
  }

  removePart(taskIndex: number, partIndex: number) {
    const partsArray = this.getPartsUsed(taskIndex);
    partsArray.removeAt(partIndex);
  }

  onSubmit() {
    if (this.form.valid) {
      this.onSave.emit(this.form.value);
    }
  }
}
