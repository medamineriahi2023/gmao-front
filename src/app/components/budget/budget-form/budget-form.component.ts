import { Component, Inject, Output, EventEmitter } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { MatFormFieldModule } from '@angular/material/form-field';
    import { MatInputModule } from '@angular/material/input';
    import { MatButtonModule } from '@angular/material/button';
    import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { MatSnackBar } from '@angular/material/snack-bar';
    import { Budget } from '../../../models/budget.model';

    @Component({
      selector: 'app-budget-form',
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
        <h2 mat-dialog-title>Ajouter un Budget</h2>
        <mat-dialog-content>
          <form [formGroup]="budgetForm" (ngSubmit)="onSubmit()" class="budget-form">
            <mat-form-field appearance="outline">
              <mat-label>Année</mat-label>
              <input matInput type="number" formControlName="year" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Budget Global (€)</mat-label>
              <input matInput type="number" formControlName="globalBudget" required (input)="updateBudget()">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Maintenance (€)</mat-label>
              <input matInput type="number" formControlName="maintenanceBudget" required (input)="updateBudget()">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Contrats de sous-traitance (€)</mat-label>
              <input matInput type="number" formControlName="subcontractingBudget" required (input)="updateBudget()">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Budget Fixe (€)</mat-label>
              <input matInput type="number" formControlName="fixedBudget" required (input)="updateBudget()">
            </mat-form-field>
          </form>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
          <button mat-button mat-dialog-close>Annuler</button>
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!budgetForm.valid">
            Enregistrer
          </button>
        </mat-dialog-actions>
      `,
      styles: [`
        .budget-form {
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
    export class BudgetFormComponent {
      budgetForm: FormGroup;

      constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<BudgetFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { budget: Budget | null },
        private snackBar: MatSnackBar
      ) {
        this.budgetForm = this.fb.group({
          year: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(new Date().getFullYear() + 1)]],
          globalBudget: [0, [Validators.required, Validators.min(0)]],
          maintenanceBudget: [0, [Validators.required, Validators.min(0)]],
          subcontractingBudget: [0, [Validators.required, Validators.min(0)]],
          fixedBudget: [0, [Validators.required, Validators.min(0)]]
        });

        if (data.budget) {
          this.budgetForm.patchValue(data.budget);
        }
      }

      updateBudget() {
        const globalBudget = this.budgetForm.get('globalBudget')?.value || 0;
        const maintenanceBudget = this.budgetForm.get('maintenanceBudget')?.value || 0;
        const subcontractingBudget = this.budgetForm.get('subcontractingBudget')?.value || 0;
        const fixedBudget = this.budgetForm.get('fixedBudget')?.value || 0;
        const totalVariableBudget = maintenanceBudget + subcontractingBudget;

        if (totalVariableBudget + fixedBudget !== globalBudget) {
          this.budgetForm.setErrors({ budgetMismatch: true });
        } else {
          this.budgetForm.setErrors(null);
        }
      }

      onSubmit() {
        if (this.budgetForm.valid) {
          this.dialogRef.close(this.budgetForm.value);
        } else {
          this.snackBar.open('La somme des budgets doit être égale au budget global.', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      }
    }
