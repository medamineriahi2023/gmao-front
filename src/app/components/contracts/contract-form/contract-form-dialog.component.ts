import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Contract } from '../../../models/contract.model';
import { ContractFormComponent } from './contract-form.component';

@Component({
  selector: 'app-contract-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ContractFormComponent],
  template: `
    <h2 mat-dialog-title>{{data.contract ? 'Modifier' : 'Créer'}} un contrat</h2>
    <mat-dialog-content>
      <app-contract-form
        [contract]="data.contract"
        (onSave)="onSave($event)"
        (onCancel)="onCancel()">
      </app-contract-form>
    </mat-dialog-content>
  `
})
export class ContractFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ContractFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contract: Contract | null }
  ) {}

  onSave(contract: Partial<Contract>) {
    this.dialogRef.close(contract);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
