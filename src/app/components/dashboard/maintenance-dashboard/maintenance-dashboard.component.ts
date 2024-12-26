import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { registerables } from 'chart.js';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { WorkOrder, WorkOrderStatus } from '../../../models/work-order.model';
import { DashboardService } from '../../../services/dashboard.service';
import { WorkOrderService } from '../../../services/work-order.service';
import { AuthService } from '../../../services/auth.service';
import { AssignTechnicianDialog } from './assign-technician-dialog/assign-technician-dialog.component';
import { UpdateStatusDialog } from './update-status-dialog/update-status-dialog.component';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog.component';

interface WorkOrderSummary extends WorkOrder {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  remainingTasks: number;
}

interface DashboardStats {
  inProgress: number;
  planned: number;
  completedToday: number;
  completionRate: number;
}

interface TechnicianWorkload {
  id: number;
  name: string;
  activeTasksCount: number;
  efficiency: number;
}

@Component({
  selector: 'app-maintenance-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    BaseChartDirective
  ],
  template: `
    <div class="dashboard-container">
      <!-- En-tête du tableau de bord -->
      <div class="dashboard-header">
        <h1>Tableau de bord maintenance</h1>
        <div class="filters-section">
          <mat-card>
            <mat-card-content>
              <div class="filters-grid">
                <!-- Période -->
                <mat-form-field appearance="outline">
                  <mat-label>Période</mat-label>
                  <mat-select [(ngModel)]="selectedPeriod" (selectionChange)="onPeriodChange()">
                    <mat-option value="today">Aujourd'hui</mat-option>
                    <mat-option value="week">Cette semaine</mat-option>
                    <mat-option value="month">Ce mois</mat-option>
                    <mat-option value="custom">Personnalisé</mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Dates personnalisées -->
                <div class="date-range" *ngIf="selectedPeriod === 'custom'">
                  <mat-form-field appearance="outline">
                    <mat-label>Date début</mat-label>
                    <input matInput [matDatepicker]="startPicker" [(ngModel)]="dateRange.start" (dateChange)="onDateRangeChange()">
                    <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                    <mat-datepicker #startPicker></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Date fin</mat-label>
                    <input matInput [matDatepicker]="endPicker" [(ngModel)]="dateRange.end" (dateChange)="onDateRangeChange()">
                    <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                    <mat-datepicker #endPicker></mat-datepicker>
                  </mat-form-field>
                </div>

                <!-- Statut -->
                <mat-form-field appearance="outline">
                  <mat-label>Statut</mat-label>
                  <mat-select [(ngModel)]="selectedStatus" (selectionChange)="onFiltersChange()" multiple>
                    <mat-option value="planned">Planifié</mat-option>
                    <mat-option value="in_progress">En cours</mat-option>
                    <mat-option value="completed">Terminé</mat-option>
                    <mat-option value="cancelled">Annulé</mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Technicien -->
                <mat-form-field appearance="outline">
                  <mat-label>Technicien</mat-label>
                  <mat-select [(ngModel)]="selectedTechnician" (selectionChange)="onFiltersChange()">
                    <mat-option [value]="null">Tous</mat-option>
                    <mat-option *ngFor="let tech of technicians" [value]="tech.id">
                      {{tech.name}}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- KPIs -->
      <div class="kpi-grid">
        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-icon">
              <mat-icon [class.active]="stats.inProgress > 0">build</mat-icon>
            </div>
            <div class="kpi-details">
              <span class="kpi-label">En cours</span>
              <span class="kpi-value">{{stats.inProgress}}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-icon">
              <mat-icon [class.active]="stats.planned > 0">schedule</mat-icon>
            </div>
            <div class="kpi-details">
              <span class="kpi-label">Planifiées</span>
              <span class="kpi-value">{{stats.planned}}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-icon">
              <mat-icon [class.active]="stats.completedToday > 0">done_all</mat-icon>
            </div>
            <div class="kpi-details">
              <span class="kpi-label">Terminées aujourd'hui</span>
              <span class="kpi-value">{{stats.completedToday}}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-icon">
              <mat-icon [class.active]="stats.completionRate > 50">trending_up</mat-icon>
            </div>
            <div class="kpi-details">
              <span class="kpi-label">Taux de complétion</span>
              <span class="kpi-value">{{stats.completionRate}}%</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Graphiques -->
      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Distribution des interventions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="statusChartData"
              [options]="pieChartOptions"
              type="pie">
            </canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Tendance des interventions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="trendChartData"
              [options]="lineChartOptions"
              type="line">
            </canvas>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Charge de travail des techniciens -->
      <mat-card class="technician-workload-card">
        <mat-card-header>
          <mat-card-title>Charge de travail des techniciens</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="technician-grid">
            <div class="technician-card" *ngFor="let tech of technicianWorkload">
              <div class="technician-header">
                <span class="technician-name">{{tech.name}}</span>
                <span class="task-count" [class.overload]="tech.activeTasksCount > averageTasksPerTech * 1.5">
                  {{tech.activeTasksCount}} tâches
                </span>
              </div>
              <mat-progress-bar
                [color]="tech.activeTasksCount > averageTasksPerTech * 1.5 ? 'warn' : 'primary'"
                mode="determinate"
                [value]="(tech.activeTasksCount / maxTechnicianTasks) * 100">
              </mat-progress-bar>
              <div class="efficiency-indicator">
                <mat-icon [class.high-efficiency]="tech.efficiency > 80">
                  {{tech.efficiency > 80 ? 'trending_up' : 'trending_flat'}}
                </mat-icon>
                <span>{{tech.efficiency}}% efficacité</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tableau des interventions -->
      <mat-card class="work-orders-card">
        <mat-card-header>
          <mat-card-title>Interventions actives</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="activeWorkOrders" matSort (matSortChange)="sortData($event)">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
              <td mat-cell *matCellDef="let workOrder">
                <span class="work-order-id">#{{workOrder.id}}</span>
              </td>
            </ng-container>

            <!-- Title Column -->
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Titre </th>
              <td mat-cell *matCellDef="let workOrder">
                <div class="work-order-info">
                  <div class="work-order-title">{{workOrder.title}}</div>
                  <div class="work-order-description">{{workOrder.description}}</div>
                </div>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Statut </th>
              <td mat-cell *matCellDef="let workOrder">
                <div class="status-chip status-{{workOrder.status}}">
                  <mat-icon class="status-icon">{{getStatusIcon(workOrder.status)}}</mat-icon>
                  <span>{{getStatusLabel(workOrder.status)}}</span>
                </div>
              </td>
            </ng-container>

            <!-- Progress Column -->
            <ng-container matColumnDef="progress">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Progression </th>
              <td mat-cell *matCellDef="let workOrder">
                <div class="progress-container">
                  <mat-progress-bar mode="determinate" [value]="workOrder.progress">
                  </mat-progress-bar>
                  <span class="progress-text">
                    {{workOrder.completedTasks}}/{{workOrder.totalTasks}}
                  </span>
                </div>
              </td>
            </ng-container>

            <!-- Technician Column -->
            <ng-container matColumnDef="technician">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Technicien </th>
              <td mat-cell *matCellDef="let workOrder">
                <div class="technician-info">
                  <mat-icon>person</mat-icon>
                  <span>{{getTechnicianName(workOrder.assignedTechnicianId)}}</span>
                </div>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let workOrder">
                <div class="action-buttons">
                  <button mat-icon-button [matMenuTriggerFor]="menu" 
                          matTooltip="Options" 
                          (click)="$event.stopPropagation()">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="viewWorkOrder(workOrder)">
                      <mat-icon>visibility</mat-icon>
                      <span>Voir les détails</span>
                    </button>
                    <button mat-menu-item (click)="editWorkOrder(workOrder)" 
                            *ngIf="canEditWorkOrder(workOrder)">
                      <mat-icon>edit</mat-icon>
                      <span>Modifier</span>
                    </button>
                    <button mat-menu-item (click)="assignTechnician(workOrder)" 
                            *ngIf="canAssignTechnician(workOrder)">
                      <mat-icon>person_add</mat-icon>
                      <span>Assigner un technicien</span>
                    </button>
                    <button mat-menu-item (click)="updateStatus(workOrder)" 
                            *ngIf="canUpdateStatus(workOrder)">
                      <mat-icon>update</mat-icon>
                      <span>Changer le statut</span>
                    </button>
                    <mat-divider></mat-divider>
                    <button mat-menu-item class="delete-action" 
                            (click)="deleteWorkOrder(workOrder)"
                            *ngIf="canDeleteWorkOrder(workOrder)">
                      <mat-icon color="warn">delete</mat-icon>
                      <span>Supprimer</span>
                    </button>
                  </mat-menu>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                [class.selected-row]="selectedWorkOrder?.id === row.id"
                (click)="viewWorkOrder(row)"
                class="clickable-row">
            </tr>
          </table>

          <mat-paginator
            [length]="totalWorkOrders"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 25]"
            (page)="onPageChange($event)">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      background-color: #f5f5f5;
      min-height: 100vh;
    }

    .dashboard-header {
      margin-bottom: 24px;
    }

    .dashboard-header h1 {
      font-size: 24px;
      font-weight: 500;
      color: #1976d2;
      margin: 0 0 16px 0;
    }

    .filters-section mat-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      align-items: start;
    }

    .date-range {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .kpi-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
    }

    .kpi-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 16px;
    }

    .kpi-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }

    .kpi-icon mat-icon {
      font-size: 24px;
      color: #666;
    }

    .kpi-icon mat-icon.active {
      color: #1976d2;
    }

    .kpi-details {
      flex: 1;
    }

    .kpi-label {
      display: block;
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }

    .kpi-value {
      display: block;
      font-size: 24px;
      font-weight: 500;
      color: #1976d2;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .chart-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .chart-card mat-card-header {
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .chart-card mat-card-content {
      padding: 16px;
      height: 300px;
    }

    .technician-workload-card {
      margin-bottom: 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .technician-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .technician-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
    }

    .technician-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .technician-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .task-count {
      font-size: 12px;
      color: #666;
    }

    .task-count.overload {
      color: #f44336;
    }

    .efficiency-indicator {
      display: flex;
      align-items: center;
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }

    .efficiency-indicator mat-icon {
      font-size: 16px;
      margin-right: 4px;
    }

    .efficiency-indicator .high-efficiency {
      color: #4caf50;
    }

    .work-orders-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
    }

    .mat-mdc-row {
      transition: background-color 0.2s;
    }

    .clickable-row:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }

    .work-order-id {
      font-weight: 500;
      color: #1976d2;
    }

    .work-order-info {
      padding: 8px 0;
    }

    .work-order-title {
      font-weight: 500;
      color: #2c3e50;
    }

    .work-order-description {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-icon {
      font-size: 16px;
      margin-right: 4px;
    }

    .status-planned {
      background: #e3f2fd;
      color: #1565c0;
    }

    .status-in_progress {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-completed {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-cancelled {
      background: #ffebee;
      color: #c62828;
    }

    .progress-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .progress-text {
      min-width: 60px;
      font-size: 12px;
      color: #666;
    }

    .technician-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .technician-info mat-icon {
      font-size: 16px;
      color: #666;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .action-buttons:hover {
      opacity: 1;
    }

    .delete-action {
      color: #f44336;
    }

    .selected-row {
      background-color: rgba(25, 118, 210, 0.05);
    }

    .clickable-row {
      position: relative;
    }

    .clickable-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .clickable-row:active {
      background-color: rgba(0, 0, 0, 0.08);
    }

    .mat-mdc-row .mat-mdc-cell {
      border-bottom: 1px solid transparent;
      border-top: 1px solid transparent;
    }

    .mat-mdc-row:hover .mat-mdc-cell {
      border-color: currentColor;
    }

    @media (max-width: 600px) {
      .dashboard-container {
        padding: 16px;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }

      .technician-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MaintenanceDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  displayedColumns = ['id', 'title', 'status', 'progress', 'technician', 'actions'];
  activeWorkOrders: WorkOrderSummary[] = [];
  totalWorkOrders = 0;
  pageSize = 10;
  currentPage = 0;

  stats: DashboardStats = {
    inProgress: 0,
    planned: 0,
    completedToday: 0,
    completionRate: 0,
  };

  // Filtres
  selectedPeriod = 'week';
  dateRange = {
    start: new Date(),
    end: new Date()
  };
  selectedStatus: WorkOrderStatus[] = ['planned', 'in_progress'];
  selectedTechnician: number | null = null;
  technicians: any[] = []; // À remplacer par le vrai type

  // Graphiques
  statusChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Planifié', 'En cours', 'Terminé', 'Annulé'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#1565c0', '#f57c00', '#2e7d32', '#c62828']
    }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'right' }
    }
  };

  trendChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Interventions planifiées',
        data: [],
        borderColor: '#1565c0',
        tension: 0.1
      },
      {
        label: 'Interventions terminées',
        data: [],
        borderColor: '#2e7d32',
        tension: 0.1
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // KPIs
  averageInterventionTime = 0;
  timeEfficiencyTrend = 0;
  firstTimeFixRate = 0;
  fixRateTrend = 0;
  technicianWorkload: TechnicianWorkload[] = [];
  maxTechnicianTasks = 0;
  averageTasksPerTech = 0;

  selectedWorkOrder: WorkOrder | null = null;

  constructor(
    private dashboardService: DashboardService,
    private workOrderService: WorkOrderService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {
    this.initializeDateRange();
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeDateRange() {
    const today = new Date();
    switch (this.selectedPeriod) {
      case 'today':
        this.dateRange.start = today;
        this.dateRange.end = today;
        break;
      case 'week':
        this.dateRange.start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.dateRange.end = today;
        break;
      case 'month':
        this.dateRange.start = new Date(today.getFullYear(), today.getMonth(), 1);
        this.dateRange.end = today;
        break;
    }
  }

  private loadDashboardData() {
    this.dashboardService.getDashboardData(this.dateRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Mettre à jour les statistiques
        this.stats = data.stats;

        // Mettre à jour les KPIs
        this.averageInterventionTime = data.stats.averageInterventionTime;
        this.timeEfficiencyTrend = data.stats.timeEfficiencyTrend;
        this.firstTimeFixRate = data.stats.firstTimeFixRate;
        this.fixRateTrend = data.stats.fixRateTrend;

        // Mettre à jour la charge de travail des techniciens
        this.technicianWorkload = data.technicianWorkload;
        this.maxTechnicianTasks = Math.max(...data.technicianWorkload.map(t => t.activeTasksCount));
        this.averageTasksPerTech = data.technicianWorkload.reduce((sum, t) => sum + t.activeTasksCount, 0) / 
                                 data.technicianWorkload.length;

        // Mettre à jour les graphiques
        this.updateCharts(data.workOrders);

        // Mettre à jour le tableau des interventions
        this.updateWorkOrdersTable(data.workOrders);
      });
  }

  private updateCharts(workOrders: WorkOrder[]) {
    // Mise à jour du graphique en camembert
    const statusCounts = {
      planned: workOrders.filter(wo => wo.status === 'planned').length,
      in_progress: workOrders.filter(wo => wo.status === 'in_progress').length,
      completed: workOrders.filter(wo => wo.status === 'completed').length,
      cancelled: workOrders.filter(wo => wo.status === 'cancelled').length
    };

    this.statusChartData = {
      labels: ['Planifié', 'En cours', 'Terminé', 'Annulé'],
      datasets: [{
        data: [
          statusCounts.planned,
          statusCounts.in_progress,
          statusCounts.completed,
          statusCounts.cancelled
        ],
        backgroundColor: ['#1565c0', '#f57c00', '#2e7d32', '#c62828']
      }]
    };

    // Mise à jour du graphique de tendance
    const dateLabels = this.generateDateLabels();
    const plannedData = this.generateTrendData(workOrders, 'planned', dateLabels);
    const completedData = this.generateTrendData(workOrders, 'completed', dateLabels);

    this.trendChartData = {
      labels: dateLabels,
      datasets: [
        {
          label: 'Interventions planifiées',
          data: plannedData,
          borderColor: '#1565c0',
          tension: 0.1
        },
        {
          label: 'Interventions terminées',
          data: completedData,
          borderColor: '#2e7d32',
          tension: 0.1
        }
      ]
    };
  }

  private updateWorkOrdersTable(workOrders: WorkOrder[]) {
    this.totalWorkOrders = workOrders.length;
    this.activeWorkOrders = workOrders
      .filter(wo => ['planned', 'in_progress'].includes(wo.status))
      .map(wo => {
        const completedTasks = wo.tasks?.filter(t => t.status === 'completed').length || 0;
        const totalTasks = wo.tasks?.length || 0;
        return {
          ...wo,
          completedTasks,
          totalTasks,
          remainingTasks: totalTasks - completedTasks,
          progress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        };
      });

    this.sortData({ active: 'status', direction: 'asc' });
  }

  onPeriodChange() {
    this.initializeDateRange();
    this.loadDashboardData();
  }

  onDateRangeChange() {
    if (this.dateRange.start && this.dateRange.end) {
      this.loadDashboardData();
    }
  }

  onFiltersChange() {
    this.loadDashboardData();
  }

  private generateDateLabels(): string[] {
    const labels = [];
    let currentDate = new Date(this.dateRange.start);
    while (currentDate <= this.dateRange.end) {
      labels.push(currentDate.toLocaleDateString());
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
    return labels;
  }

  private generateTrendData(workOrders: WorkOrder[], status: string, dates: string[]): number[] {
    return dates.map(date => {
      const dayStart = new Date(date);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      return workOrders.filter(wo => 
        wo.status === status &&
        new Date(wo.createdAt) >= dayStart &&
        new Date(wo.createdAt) < dayEnd
      ).length;
    });
  }

  sortData(sort: Sort) {
    this.activeWorkOrders = this.activeWorkOrders.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'title': return this.compare(a.title, b.title, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'progress': return this.compare(a.progress, b.progress, isAsc);
        case 'technician': return this.compare(a.assignedTechnicianId, b.assignedTechnicianId, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }

  viewWorkOrder(workOrder: WorkOrder) {
    this.selectedWorkOrder = workOrder;
    this.router.navigate(['/work-orders', workOrder.id]);
  }

  editWorkOrder(workOrder: WorkOrder) {
    this.router.navigate(['/work-orders', workOrder.id, 'edit']);
  }

  assignTechnician(workOrder: WorkOrder): void {
    const dialogRef = this.dialog.open(AssignTechnicianDialog, {
      width: '400px',
      data: { workOrder, technicians: this.technicians }
    });

    dialogRef.afterClosed().subscribe((result: { technicianId: number } | undefined) => {
      if (result) {
        this.workOrderService.assignTechnician(workOrder.id, result.technicianId)
          .subscribe({
            next: () => {
              this.snackBar.open('Technicien assigné avec succès', 'Fermer', { duration: 3000 });
              this.refreshData();
            },
            error: (error: Error) => {
              this.snackBar.open('Erreur lors de l\'assignation du technicien', 'Fermer', { duration: 3000 });
              console.error('Erreur d\'assignation:', error);
            }
          });
      }
    });
  }

  updateStatus(workOrder: WorkOrder): void {
    const dialogRef = this.dialog.open(UpdateStatusDialog, {
      width: '400px',
      data: { workOrder, currentStatus: workOrder.status }
    });

    dialogRef.afterClosed().subscribe((result: { status: WorkOrderStatus } | undefined) => {
      if (result) {
        this.workOrderService.updateStatus(workOrder.id, result.status)
          .subscribe({
            next: () => {
              this.snackBar.open('Statut mis à jour avec succès', 'Fermer', { duration: 3000 });
              this.refreshData();
            },
            error: (error: Error) => {
              this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000 });
              console.error('Erreur de mise à jour:', error);
            }
          });
      }
    });
  }

  deleteWorkOrder(workOrder: WorkOrder): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer l'intervention "${workOrder.title}" ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.workOrderService.deleteWorkOrder(workOrder.id)
          .subscribe({
            next: () => {
              this.snackBar.open('Intervention supprimée avec succès', 'Fermer', { duration: 3000 });
              this.refreshData();
            },
            error: (error: Error) => {
              this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
              console.error('Erreur de suppression:', error);
            }
          });
      }
    });
  }

  canEditWorkOrder(workOrder: WorkOrder): boolean {
    const user = this.auth.getCurrentUser();
    return user?.role === 'maintenance_chief' || 
           (user?.role === 'technician' && workOrder.assignedTechnicianId === user.id);
  }

  canAssignTechnician(workOrder: WorkOrder): boolean {
    return this.auth.getCurrentUser()?.role === 'maintenance_chief';
  }

  canUpdateStatus(workOrder: WorkOrder): boolean {
    const user = this.auth.getCurrentUser();
    return user?.role === 'maintenance_chief' || 
           (user?.role === 'technician' && workOrder.assignedTechnicianId === user.id);
  }

  canDeleteWorkOrder(workOrder: WorkOrder): boolean {
    return this.auth.getCurrentUser()?.role === 'maintenance_chief';
  }

  private refreshData() {
    this.loadWorkOrders();
    this.loadStatistics();
    this.loadCharts();
  }

  private loadWorkOrders(): void {
    this.dashboardService.getWorkOrders(this.dateRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe((workOrders: WorkOrder[]) => {
        this.totalWorkOrders = workOrders.length;
        this.activeWorkOrders = workOrders
          .filter((wo: WorkOrder) => ['planned', 'in_progress'].includes(wo.status))
          .map((wo: WorkOrder) => {
            const completedTasks = wo.tasks?.filter((t: { status: string }) => t.status === 'completed').length || 0;
            const totalTasks = wo.tasks?.length || 0;
            return {
              ...wo,
              completedTasks,
              totalTasks,
              remainingTasks: totalTasks - completedTasks,
              progress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
            };
          });
      });
  }

  private loadStatistics(): void {
    this.dashboardService.getStatistics(this.dateRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats: DashboardStats) => {
        this.stats = stats;
      });
  }

  private loadCharts(): void {
    this.dashboardService.getWorkOrders(this.dateRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe((workOrders: WorkOrder[]) => {
        this.updateCharts(workOrders);
      });
  }

  getStatusLabel(status: WorkOrderStatus): string {
    const statusLabels: Record<WorkOrderStatus, string> = {
      'planned': 'Planifié',
      'in_progress': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return statusLabels[status] || status;
  }

  getTechnicianName(technicianId: number): string {
    // Dans un environnement réel, ceci ferait un appel au service pour obtenir le nom du technicien
    const technicians: Record<number, string> = {
      1: 'John Doe',
      2: 'Jane Smith',
      3: 'Bob Wilson'
    };
    return technicians[technicianId] || `Technicien ${technicianId}`;
  }

  getStatusIcon(status: WorkOrderStatus): string {
    const statusIcons: Record<WorkOrderStatus, string> = {
      'planned': 'schedule',
      'in_progress': 'engineering',
      'completed': 'check_circle',
      'cancelled': 'cancel'
    };
    return statusIcons[status] || 'help';
  }

  protected readonly Math = Math;
}
