import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Contract } from '../../../models/contract.model';
import { ContractDetailsComponent } from './contract-details.component';

@Component({
  selector: 'app-contract-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ContractDetailsComponent],
  template: `
    <h2 mat-dialog-title>Détails du contrat</h2>
    <mat-dialog-content>
      <app-contract-details [contract]="data.contract"></app-contract-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `
})
export class ContractDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ContractDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contract: Contract }
  ) {}
}
