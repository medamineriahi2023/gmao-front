import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrder, WorkOrderStatus } from '../../../../models/work-order.model';

interface DialogData {
  workOrder: WorkOrder;
  currentStatus: WorkOrderStatus;
}

@Component({
  selector: 'app-update-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Mettre à jour le statut</h2>
    <mat-dialog-content>
      <p>Changer le statut de l'intervention "{{data.workOrder.title}}"</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nouveau statut</mat-label>
        <mat-select [(ngModel)]="selectedStatus">
          <mat-option *ngFor="let status of availableStatuses" [value]="status.value">
            {{status.label}}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="!selectedStatus || selectedStatus === data.currentStatus"
              (click)="onConfirm()">
        Mettre à jour
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      min-width: 300px;
    }
    p {
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.6);
    }
  `]
})
export class UpdateStatusDialog {
  selectedStatus: WorkOrderStatus | null = null;
  availableStatuses = [
    { value: 'planned', label: 'Planifié' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  constructor(
    public dialogRef: MatDialogRef<UpdateStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Filtrer les statuts disponibles en fonction du statut actuel
    this.filterAvailableStatuses();
  }

  private filterAvailableStatuses() {
    const currentStatus = this.data.currentStatus;
    
    // Logique de transition des statuts
    switch (currentStatus) {
      case 'planned':
        this.availableStatuses = this.availableStatuses.filter(s => 
          ['in_progress', 'cancelled'].includes(s.value as WorkOrderStatus));
        break;
      case 'in_progress':
        this.availableStatuses = this.availableStatuses.filter(s => 
          ['completed', 'cancelled'].includes(s.value as WorkOrderStatus));
        break;
      case 'completed':
      case 'cancelled':
        this.availableStatuses = []; // Pas de changement possible
        break;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedStatus) {
      this.dialogRef.close({ status: this.selectedStatus });
    }
  }
}
