import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PurchaseRequest } from '../../../models/purchase-request.model';

@Component({
  selector: 'app-purchase-request-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="purchase-request-dialog">
      <h2 mat-dialog-title>Demande d'achat de pièces</h2>
      
      <form [formGroup]="purchaseForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <!-- Nom de la pièce -->
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Nom de la pièce</mat-label>
            <input matInput formControlName="item" required>
          </mat-form-field>

          <!-- Quantité -->
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Quantité</mat-label>
            <input matInput type="number" formControlName="quantity" required min="1">
          </mat-form-field>

          <!-- Description / Justification -->
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Description / Justification</mat-label>
            <textarea matInput formControlName="description" rows="4" required></textarea>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Annuler</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!purchaseForm.valid">
            Soumettre la demande
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .purchase-request-dialog {
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    mat-dialog-content {
      min-width: 400px;
    }

    textarea {
      min-height: 100px;
    }

    mat-dialog-actions {
      margin-top: 20px;
      gap: 10px;
    }
  `]
})
export class PurchaseRequestDialogComponent {
  purchaseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PurchaseRequestDialogComponent>
  ) {
    this.purchaseForm = this.fb.group({
      item: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.purchaseForm.valid) {
      const request: Partial<PurchaseRequest> = {
        ...this.purchaseForm.value,
        status: 'pending'
      };
      this.dialogRef.close(request);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
