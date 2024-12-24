import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { WorkOrder } from '../../../models/work-order.model';
import { WorkOrderFormComponent } from './work-order-form.component';

@Component({
  selector: 'app-work-order-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, WorkOrderFormComponent],
  template: `
    <h2 mat-dialog-title>{{data.workOrder ? 'Modifier' : 'Créer'}} un bon de travail</h2>
    <mat-dialog-content>
      <app-work-order-form
        [workOrder]="data.workOrder"
        (onSave)="onSave($event)"
        (onCancel)="onCancel()">
      </app-work-order-form>
    </mat-dialog-content>
  `
})
export class WorkOrderFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<WorkOrderFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { workOrder: WorkOrder | null }
  ) {}

  onSave(workOrder: Partial<WorkOrder>) {
    this.dialogRef.close(workOrder);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
