import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { WorkOrder } from '../../../models/work-order.model';
import { WorkOrderDetailsComponent } from './work-order-details.component';

@Component({
  selector: 'app-work-order-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, WorkOrderDetailsComponent],
  template: `
    <h2 mat-dialog-title>Détails du bon de travail</h2>
    <mat-dialog-content>
      <app-work-order-details [workOrder]="data.workOrder"></app-work-order-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `
})
export class WorkOrderDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<WorkOrderDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { workOrder: WorkOrder }
  ) {}
}
