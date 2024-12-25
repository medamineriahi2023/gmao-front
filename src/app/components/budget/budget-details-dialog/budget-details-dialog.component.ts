import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Budget } from '../../../models/budget.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-budget-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    CardModule,
    ChartModule,
    DividerModule,
    ButtonModule
  ],
  template: `
    <div class="budget-details">
      <div class="header">
        <h2>Budget {{data.budget.year}}</h2>
        <p class="subtitle">Détails et répartition du budget</p>
      </div>

      <div class="content-grid">
        <div class="budget-section">
          <p-card styleClass="global-budget">
            <div class="budget-card-content">
              <div class="budget-info">
                <span class="label">Budget Global</span>
                <span class="value">{{data.budget.globalBudget | currency:'EUR'}}</span>
              </div>
              <i class="pi pi-wallet budget-icon"></i>
            </div>
          </p-card>

          <div class="breakdown-grid">
            <p-card>
              <div class="budget-card-content">
                <div class="budget-info">
                  <span class="label">Maintenance</span>
                  <span class="value">{{data.budget.maintenanceBudget | currency:'EUR'}}</span>
                  <span class="percentage">
                    {{(data.budget.maintenanceBudget / data.budget.globalBudget * 100).toFixed(1)}}%
                  </span>
                </div>
                <i class="pi pi-cog budget-icon"></i>
              </div>
            </p-card>

            <p-card>
              <div class="budget-card-content">
                <div class="budget-info">
                  <span class="label">Sous-traitance</span>
                  <span class="value">{{data.budget.subcontractingBudget | currency:'EUR'}}</span>
                  <span class="percentage">
                    {{(data.budget.subcontractingBudget / data.budget.globalBudget * 100).toFixed(1)}}%
                  </span>
                </div>
                <i class="pi pi-users budget-icon"></i>
              </div>
            </p-card>

            <p-card>
              <div class="budget-card-content">
                <div class="budget-info">
                  <span class="label">Budget Fixe</span>
                  <span class="value">{{data.budget.fixedBudget | currency:'EUR'}}</span>
                  <span class="percentage">
                    {{(data.budget.fixedBudget / data.budget.globalBudget * 100).toFixed(1)}}%
                  </span>
                </div>
                <i class="pi pi-calculator budget-icon"></i>
              </div>
            </p-card>
          </div>
        </div>

        <div class="chart-section">
          <p-chart type="doughnut" [data]="chartData" [options]="chartOptions"></p-chart>
        </div>
      </div>

      <div class="dialog-footer">
        <p-button 
          label="Fermer" 
          icon="pi pi-times" 
          styleClass="p-button-text"
          (onClick)="close()">
        </p-button>
      </div>
    </div>
  `,
  styles: [`
  .budget-details {
  padding: 1.5rem;
  width: auto;
  margin: 0 auto;
  overflow: hidden; /* Prevent horizontal overflow */
}

    .header {
      text-align: center;
      margin-bottom: 1.5rem;

      h2 {
        color: var(--primary-color);
        font-size: 1.5rem;
        margin: 0;
      }

      .subtitle {
        color: var(--text-color-secondary);
        margin: 0.5rem 0 0;
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .budget-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    ::ng-deep {
      .budget-card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
      }

      .global-budget {
        background: linear-gradient(135deg, var(--primary-color), var(--primary-400));
        
        .budget-card-content {
          color: white;
        }

        .budget-info {
          .label, .value {
            color: white;
          }
        }

        .budget-icon {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .budget-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .label {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
      }

      .value {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .percentage {
        font-size: 0.875rem;
        color: var(--primary-color);
        font-weight: 500;
      }
    }

    .budget-icon {
      font-size: 2rem;
      color: var(--primary-color);
      opacity: 0.8;
    }

    .chart-section {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    @media (max-width: 1200px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .breakdown-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    }
  `]
})
export class BudgetDetailsDialogComponent {
  chartData: any;
  chartOptions: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { budget: Budget },
    private dialogRef: MatDialogRef<BudgetDetailsDialogComponent>
  ) {
    this.initializeChart();
  }

  private initializeChart() {
    this.chartData = {
      labels: ['Maintenance', 'Sous-traitance', 'Budget Fixe'],
      datasets: [
        {
          data: [
            this.data.budget.maintenanceBudget,
            this.data.budget.subcontractingBudget,
            this.data.budget.fixedBudget
          ],
          backgroundColor: [
            'rgba(156, 39, 176, 0.8)',
            'rgba(156, 39, 176, 0.6)',
            'rgba(156, 39, 176, 0.4)'
          ],
          borderColor: 'white',
          borderWidth: 2
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'var(--text-color)'
          }
        }
      },
      cutout: '60%',
      responsive: true,
      maintainAspectRatio: true
    };
  }

  close() {
    this.dialogRef.close();
  }
}