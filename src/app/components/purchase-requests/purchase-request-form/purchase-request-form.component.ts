import { Component, Inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { MatFormFieldModule } from '@angular/material/form-field';
    import { MatInputModule } from '@angular/material/input';
    import { MatButtonModule } from '@angular/material/button';
    import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { PurchaseRequest } from '../../../models/purchase-request.model';
    import { AuthService } from '../../../services/auth.service';

    @Component({
      selector: 'app-purchase-request-form',
      standalone: true,
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule
      ],
      template: `
        <h2 mat-dialog-title>{{data.request ? 'Modifier' : 'Nouvelle'}} Demande d'Achat</h2>
        <mat-dialog-content>
          <form [formGroup]="purchaseRequestForm" (ngSubmit)="onSubmit()" class="purchase-request-form">
            <mat-form-field appearance="outline">
              <mat-label>Article</mat-label>
              <input matInput formControlName="item" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Quantité</mat-label>
              <input matInput type="number" formControlName="quantity" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>
          </form>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
          <button mat-button mat-dialog-close>Annuler</button>
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!purchaseRequestForm.valid">
            Enregistrer
          </button>
        </mat-dialog-actions>
      `,
      styles: [`
        .purchase-request-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px 0;
        }

        mat-form-field {
          width: 100%;
        }
      `]
    })
    export class PurchaseRequestFormComponent {
      purchaseRequestForm: FormGroup;

      constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<PurchaseRequestFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { request: PurchaseRequest | null },
        private authService: AuthService
      ) {
        this.purchaseRequestForm = this.fb.group({
          item: ['', Validators.required],
          quantity: [1, [Validators.required, Validators.min(1)]],
          description: ['']
        });

        if (data.request) {
          this.purchaseRequestForm.patchValue(data.request);
        }
      }

      onSubmit() {
        if (this.purchaseRequestForm.valid) {
          const user = this.authService.getCurrentUser();
          this.dialogRef.close({ ...this.purchaseRequestForm.value, requestedBy: user?.username });
        }
      }
    }
