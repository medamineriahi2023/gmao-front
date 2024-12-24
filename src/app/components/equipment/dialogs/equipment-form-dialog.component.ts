import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Equipment } from '../../../models/equipment.model';
import { EquipmentFormComponent } from '../equipment-form/equipment-form.component';

@Component({
  selector: 'app-equipment-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, EquipmentFormComponent],
  template: `
    <h2 mat-dialog-title>{{data.equipment ? 'Modifier' : 'Ajouter'}} un équipement</h2>
    <mat-dialog-content>
      <app-equipment-form
        [equipment]="data.equipment"
        (onSave)="onSave($event)"
        (onCancel)="onCancel()">
      </app-equipment-form>
    </mat-dialog-content>
  `
})
export class EquipmentFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EquipmentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipment: Equipment | null }
  ) {}

  onSave(equipment: Partial<Equipment>) {
    this.dialogRef.close(equipment);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
