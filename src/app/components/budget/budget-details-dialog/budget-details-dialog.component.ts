import { Component, Inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { MatButtonModule } from '@angular/material/button';
    import { Budget } from '../../../models/budget.model';

    @Component({
      selector: 'app-budget-details-dialog',
      standalone: true,
      imports: [CommonModule, MatDialogModule, MatButtonModule],
      template: `
        <h2 mat-dialog-title>Détails du Budget {{data.budget.year}}</h2>
        <mat-dialog-content>
          <div class="details-container">
            <div class="info-section">
              <h3>Budget Global</h3>
              <p>{{data.budget.globalBudget | currency:'EUR'}}</p>
            </div>

            <div class="info-section">
              <h3>Budget Variable</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Maintenance</span>
                  <span class="value">{{data.budget.maintenanceBudget | currency:'EUR'}}</span>
                </div>
                <div class="info-item">
                  <span class="label">Contrats de sous-traitance</span>
                  <span class="value">{{data.budget.subcontractingBudget | currency:'EUR'}}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>Budget Fixe</h3>
              <p>{{data.budget.fixedBudget | currency:'EUR'}}</p>
            </div>
          </div>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
          <button mat-button mat-dialog-close>Fermer</button>
        </mat-dialog-actions>
      `,
      styles: [`
        .details-container {
          padding: 16px;
        }

        .info-section {
          margin-bottom: 16px;
        }

        .info-section h3 {
          margin-bottom: 8px;
          font-size: 16px;
          font-weight: 500;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 12px;
          color: #666;
        }

        .value {
          font-size: 14px;
          font-weight: 500;
        }
      `]
    })
    export class BudgetDetailsDialogComponent {
      constructor(
        public dialogRef: MatDialogRef<BudgetDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { budget: Budget }
      ) {}
    }
