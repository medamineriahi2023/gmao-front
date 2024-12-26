import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Equipment } from '../../../models/equipment.model';
import { MockDataService } from '../../../services/mock-data.service';
import { PurchaseRequestDialogComponent } from '../purchase-request/purchase-request-dialog.component';
import { PurchaseRequest } from '../../../models/purchase-request.model';

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
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  template: `
    <div class="work-order-form-container">
      <h2>{{ workOrder ? 'Modifier' : 'Créer' }} un bon de travail</h2>
      
      <form [formGroup]="workOrderForm" (ngSubmit)="onSubmit()">
        <!-- Titre -->
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

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

        <!-- Demande d'achat de pièces -->
        <div class="purchase-request-section">
          <button mat-stroked-button type="button" color="accent" (click)="openPurchaseRequestDialog()">
            <mat-icon>add_shopping_cart</mat-icon>
            Demander des pièces de rechange
          </button>
          
          <!-- Liste des demandes d'achat -->
          <div *ngIf="purchaseRequests.length > 0" class="purchase-requests-list">
            <h3>Demandes d'achat :</h3>
            <mat-list>
              <mat-list-item *ngFor="let request of purchaseRequests">
                {{request.item}} (Qté: {{request.quantity}})
                <button mat-icon-button color="warn" (click)="removePurchaseRequest(request)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-list-item>
            </mat-list>
          </div>
        </div>

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

    .purchase-request-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }

    .purchase-requests-list {
      margin-top: 15px;
    }

    .purchase-requests-list h3 {
      color: #666;
      font-size: 16px;
      margin-bottom: 10px;
    }

    mat-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class WorkOrderFormComponent implements OnInit {
  workOrderForm: FormGroup;
  technicians: User[] = [];
  equipments: Equipment[] = [];
  workOrder: any = null;
  purchaseRequests: Partial<PurchaseRequest>[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<WorkOrderFormComponent>,
    private authService: AuthService,
    private mockDataService: MockDataService
  ) {
    this.workOrderForm = this.fb.group({
      title: ['', Validators.required],
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
        title: this.workOrder.title,
        equipmentId: this.workOrder.equipmentId,
        description: this.workOrder.description,
        priority: this.workOrder.priority,
        assignedTechnicianId: this.workOrder.assignedTechnicianId,
        dueDate: this.workOrder.dueDate
      });
      if (this.workOrder.purchaseRequests) {
        this.purchaseRequests = [...this.workOrder.purchaseRequests];
      }
    }
  }

  openPurchaseRequestDialog() {
    const dialogRef = this.dialog.open(PurchaseRequestDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.purchaseRequests.push(result);
      }
    });
  }

  removePurchaseRequest(request: Partial<PurchaseRequest>) {
    const index = this.purchaseRequests.indexOf(request);
    if (index > -1) {
      this.purchaseRequests.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.workOrderForm.valid) {
      const workOrder = {
        ...this.workOrderForm.value,
        purchaseRequests: this.purchaseRequests
      };
      this.dialogRef.close(workOrder);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
