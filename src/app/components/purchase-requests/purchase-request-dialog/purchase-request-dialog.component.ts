import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { PurchaseRequest } from '../../../models/purchase-request.model';

@Component({
  selector: 'app-purchase-request-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{data ? 'Modifier' : 'Nouvelle'}} demande d'achat</h2>
    <mat-dialog-content>
      <form #form="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Article</mat-label>
          <input matInput [(ngModel)]="request.item" name="item" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantité</mat-label>
          <input matInput type="number" [(ngModel)]="request.quantity" name="quantity" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="request.description" name="description" required></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Coût estimé</mat-label>
          <input matInput type="number" [(ngModel)]="request.estimatedCost" name="estimatedCost" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fournisseur</mat-label>
          <input matInput [(ngModel)]="request.supplier" name="supplier" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!form.valid">
        {{data ? 'Modifier' : 'Créer'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class PurchaseRequestDialogComponent {
  request: Partial<PurchaseRequest>;

  constructor(
    public dialogRef: MatDialogRef<PurchaseRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PurchaseRequest | null
  ) {
    this.request = data ? { ...data } : {
      item: '',
      quantity: 1,
      description: '',
      estimatedCost: 0,
      supplier: ''
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.request);
  }
}
