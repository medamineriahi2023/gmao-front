import { Injectable } from '@angular/core';
import { Observable, map, combineLatest } from 'rxjs';
import { WorkOrder } from '../models/work-order.model';
import { WorkOrderService } from './work-order.service';
import { AuthService } from './auth.service';

export interface DashboardStats {
  inProgress: number;
  planned: number;
  completedToday: number;
  completionRate: number;
  averageInterventionTime: number;
  timeEfficiencyTrend: number;
  firstTimeFixRate: number;
  fixRateTrend: number;
}

export interface TechnicianWorkload {
  id: number;
  name: string;
  activeTasksCount: number;
  completedTasksCount: number;
  efficiency: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private workOrderService: WorkOrderService,
    private authService: AuthService
  ) {}

  getDashboardData(dateRange: { start: Date; end: Date }): Observable<{
    stats: DashboardStats;
    technicianWorkload: TechnicianWorkload[];
    workOrders: WorkOrder[];
  }> {
    return this.workOrderService.getWorkOrders().pipe(
      map(workOrders => {
        const filteredOrders = this.filterWorkOrdersByDate(workOrders, dateRange);
        return {
          stats: this.calculateStats(filteredOrders),
          technicianWorkload: this.calculateTechnicianWorkload(filteredOrders),
          workOrders: filteredOrders
        };
      })
    );
  }

  getWorkOrders(dateRange: { start: Date; end: Date }): Observable<WorkOrder[]> {
    return this.workOrderService.getWorkOrders().pipe(
      map(workOrders => this.filterWorkOrdersByDate(workOrders, dateRange))
    );
  }

  getStatistics(dateRange: { start: Date; end: Date }): Observable<DashboardStats> {
    return this.workOrderService.getWorkOrders().pipe(
      map(workOrders => {
        const filteredOrders = this.filterWorkOrdersByDate(workOrders, dateRange);
        return this.calculateStats(filteredOrders);
      })
    );
  }

  private filterWorkOrdersByDate(workOrders: WorkOrder[], dateRange: { start: Date; end: Date }): WorkOrder[] {
    return workOrders.filter(wo => {
      const woDate = new Date(wo.createdAt);
      return woDate >= dateRange.start && woDate <= dateRange.end;
    });
  }

  private calculateStats(workOrders: WorkOrder[]): DashboardStats {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inProgress = workOrders.filter(wo => wo.status === 'in_progress').length;
    const planned = workOrders.filter(wo => wo.status === 'planned').length;
    const completedOrders = workOrders.filter(wo => wo.status === 'completed');
    const completedToday = completedOrders.filter(wo => {
      if (!wo.actualEndDate) return false;
      const endDate = new Date(wo.actualEndDate);
      endDate.setHours(0, 0, 0, 0);
      return endDate.getTime() === today.getTime();
    }).length;

    // Calculer le taux de complétion
    const completionRate = workOrders.length > 0
      ? (completedOrders.length / workOrders.length) * 100
      : 0;

    // Calculer le temps moyen d'intervention
    const averageTime = completedOrders.length > 0
      ? completedOrders.reduce((sum, wo) => {
          if (!wo.actualEndDate) return sum;
          const start = new Date(wo.createdAt).getTime();
          const end = new Date(wo.actualEndDate).getTime();
          return sum + (end - start);
        }, 0) / completedOrders.length / (1000 * 60) // Convertir en minutes
      : 0;

    // Calculer le taux de résolution au premier passage
    const firstTimeFixed = completedOrders.filter(wo =>
      !wo.tasks.some(task => task.status === 'pending')
    ).length;
    const firstTimeFixRate = completedOrders.length > 0
      ? (firstTimeFixed / completedOrders.length) * 100
      : 0;

    return {
      inProgress,
      planned,
      completedToday,
      completionRate: Math.round(completionRate),
      averageInterventionTime: Math.round(averageTime),
      timeEfficiencyTrend: this.calculateTrend(averageTime, 0), // À implémenter : comparer avec la période précédente
      firstTimeFixRate: Math.round(firstTimeFixRate),
      fixRateTrend: this.calculateTrend(firstTimeFixRate, 0) // À implémenter : comparer avec la période précédente
    };
  }

  private calculateTechnicianWorkload(workOrders: WorkOrder[]): TechnicianWorkload[] {
    const workloadMap = new Map<number, TechnicianWorkload>();

    workOrders.forEach(wo => {
      const techId = wo.assignedTechnicianId;
      if (!workloadMap.has(techId)) {
        workloadMap.set(techId, {
          id: techId,
          name: `Technicien ${techId}`, // À remplacer par le vrai nom une fois le service utilisateur implémenté
          activeTasksCount: 0,
          completedTasksCount: 0,
          efficiency: 0
        });
      }

      const workload = workloadMap.get(techId)!;
      const activeTasks = wo.tasks.filter(t => t.status !== 'completed').length;
      const completedTasks = wo.tasks.filter(t => t.status === 'completed').length;

      workload.activeTasksCount += activeTasks;
      workload.completedTasksCount += completedTasks;
    });

    // Calculer l'efficacité
    workloadMap.forEach(workload => {
      const totalTasks = workload.activeTasksCount + workload.completedTasksCount;
      workload.efficiency = totalTasks > 0
        ? (workload.completedTasksCount / totalTasks) * 100
        : 0;
    });

    return Array.from(workloadMap.values());
  }

  private calculateTrend(currentValue: number, previousValue: number): number {
    if (previousValue === 0) return 0;
    return ((currentValue - previousValue) / previousValue) * 100;
  }
}
