import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Equipment } from '../../../models/equipment.model';
import { EquipmentDetailsComponent } from '../equipment-details/equipment-details.component';

@Component({
  selector: 'app-equipment-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, EquipmentDetailsComponent],
  template: `
    <h2 mat-dialog-title>Détails de l'équipement</h2>
    <mat-dialog-content>
      <app-equipment-details [equipment]="data.equipment"></app-equipment-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `
})
export class EquipmentDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EquipmentDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipment: Equipment }
  ) {}
}
