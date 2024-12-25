import { Component, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { MatTableModule } from '@angular/material/table';
    import { MatButtonModule } from '@angular/material/button';
    import { MatIconModule } from '@angular/material/icon';
    import { MatDialog } from '@angular/material/dialog';
    import { MatSnackBar } from '@angular/material/snack-bar';
    import { Budget } from '../../models/budget.model';
    import { BudgetService } from '../../services/budget.service';
    import { BudgetFormComponent } from './budget-form/budget-form.component';
    import { BudgetDetailsDialogComponent } from './budget-details-dialog/budget-details-dialog.component';

    @Component({
      selector: 'app-budget',
      standalone: true,
      imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule
      ],
      template: `
        <div class="page-container">
          <div class="page-header">
            <div class="header-content">
              <h1>Gestion du Budget</h1>
              <p class="subtitle">Suivi et allocation des budgets</p>
            </div>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="budgets" class="mat-elevation-z2">
              <ng-container matColumnDef="year">
                <th mat-header-cell *matHeaderCellDef>Année</th>
                <td mat-cell *matCellDef="let budget">{{budget.year}}</td>
              </ng-container>

              <ng-container matColumnDef="globalBudget">
                <th mat-header-cell *matHeaderCellDef>Budget Global</th>
                <td mat-cell *matCellDef="let budget">{{budget.globalBudget | currency:'EUR'}}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let budget">
                  <button mat-icon-button (click)="viewBudgetDetails(budget)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            <button mat-raised-button color="primary" (click)="openBudgetForm()" class="add-button">
              <mat-icon>add</mat-icon>
              Nouveau Budget
            </button>
          </div>
        </div>
      `,
      styles: [`
        .page-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .table-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        table {
          width: 100%;
        }

        .add-button {
          margin-top: 16px;
        }
      `]
    })
    export class BudgetComponent implements OnInit {
      budgets: Budget[] = [];
      displayedColumns = ['year', 'globalBudget', 'actions'];

      constructor(
        private budgetService: BudgetService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
      ) {}

      ngOnInit() {
        this.loadBudgets();
      }

      loadBudgets() {
        this.budgetService.getBudgets().subscribe(budgets => {
          this.budgets = budgets;
        });
      }

      openBudgetForm() {
        const dialogRef = this.dialog.open(BudgetFormComponent, {
          width: '600px',
          data: { budget: null }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.budgetService.addBudget(result).subscribe(() => {
              this.loadBudgets();
              this.snackBar.open('Budget ajouté avec succès', 'Fermer', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            });
          }
        });
      }

      viewBudgetDetails(budget: Budget) {
        this.dialog.open(BudgetDetailsDialogComponent, {
          width: 'auto',
          data: { budget }
        });
      }
    }
