import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrder } from '../../../../models/work-order.model';

interface DialogData {
  workOrder: WorkOrder;
  technicians: any[];
}

@Component({
  selector: 'app-assign-technician-dialog',
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
    <h2 mat-dialog-title>Assigner un technicien</h2>
    <mat-dialog-content>
      <p>Sélectionnez un technicien pour l'intervention "{{data.workOrder.title}}"</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Technicien</mat-label>
        <mat-select [(ngModel)]="selectedTechnicianId">
          <mat-option *ngFor="let tech of data.technicians" [value]="tech.id">
            {{tech.name}}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="!selectedTechnicianId"
              (click)="onConfirm()">
        Assigner
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
export class AssignTechnicianDialog {
  selectedTechnicianId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AssignTechnicianDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedTechnicianId) {
      this.dialogRef.close({ technicianId: this.selectedTechnicianId });
    }
  }
}
