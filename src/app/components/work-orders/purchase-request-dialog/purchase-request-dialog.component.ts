import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-purchase-request-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Nouvelle demande d'achat</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nom de la pièce</mat-label>
          <input matInput formControlName="item" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Quantité</mat-label>
          <input matInput type="number" formControlName="quantity" required min="1">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description / Justification</mat-label>
          <textarea matInput formControlName="description" required rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Coût estimé</mat-label>
          <input matInput type="number" formControlName="estimatedCost">
          <span matSuffix>€</span>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Fournisseur suggéré</mat-label>
          <input matInput formControlName="supplier">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          Soumettre
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class PurchaseRequestDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PurchaseRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { workOrderId: number }
  ) {
    this.form = this.fb.group({
      item: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      estimatedCost: [null],
      supplier: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.form.value,
        workOrderId: this.data.workOrderId
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
