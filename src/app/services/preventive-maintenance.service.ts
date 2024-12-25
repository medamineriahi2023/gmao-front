import { Injectable } from '@angular/core';
import { Observable, interval, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Equipment, PreventiveMaintenance } from '../models/equipment.model';
import { WorkOrder } from '../models/work-order.model';
import { EquipmentService } from './equipment.service';
import { WorkOrderService } from './work-order.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PreventiveMaintenanceService {
  constructor(
    private equipmentService: EquipmentService,
    private workOrderService: WorkOrderService,
    private authService: AuthService
  ) {
    // Vérifier toutes les heures s'il y a des maintenances préventives à déclencher
    this.startMaintenanceCheck();
  }

  private startMaintenanceCheck() {
    interval(3600000) // 1 heure
      .pipe(
        switchMap(() => this.checkPreventiveMaintenance())
      )
      .subscribe();
  }

  checkPreventiveMaintenance(): Observable<void> {
    return this.equipmentService.getEquipments().pipe(
      map(equipments => this.filterEquipmentsNeedingMaintenance(equipments)),
      tap(equipments => {
        equipments.forEach(equipment => {
          equipment.preventiveMaintenance?.forEach(maintenance => {
            if (this.isMaintenanceNeeded(maintenance)) {
              this.createPreventiveWorkOrder(equipment, maintenance);
            }
          });
        });
      }),
      map(() => void 0)
    );
  }

  private filterEquipmentsNeedingMaintenance(equipments: Equipment[]): Equipment[] {
    return equipments.filter(equipment => 
      equipment.preventiveMaintenance?.some(maintenance => 
        maintenance.active && this.isMaintenanceNeeded(maintenance)
      )
    );
  }

  private isMaintenanceNeeded(maintenance: PreventiveMaintenance): boolean {
    const now = new Date();
    const nextExecution = new Date(maintenance.nextExecutionDate);
    return nextExecution <= now;
  }

  private createPreventiveWorkOrder(equipment: Equipment, maintenance: PreventiveMaintenance): void {
    const workOrder: Partial<WorkOrder> = {
      type: 'preventive',
      status: 'planned',
      priority: 'medium',
      equipmentId: equipment.id,
      title: `Maintenance préventive - ${maintenance.title}`,
      description: maintenance.description,
      plannedStartDate: new Date(),
      plannedEndDate: this.calculateEndDate(maintenance),
      assignedTechnicianId: maintenance.assignedTechnicianId,
      estimatedCost: 0,
      tasks: maintenance.tasks.map((task, index) => ({
        id: index + 1,
        description: task.description,
        status: 'pending',
        estimatedDuration: task.estimatedDuration,
        category: 'inspection',
        requiredSkills: [],
        safetyInstructions: [],
        technicianNotes: ''
      })),
      maintenanceData: {
        type: 'preventive',
        data: {
          frequency: maintenance.frequency,
          lastMaintenanceDate: maintenance.lastExecutionDate || new Date(),
          nextMaintenanceDate: this.calculateNextMaintenanceDate(maintenance.frequency),
          checklistItems: []
        }
      }
    };

    this.workOrderService.createWorkOrder(workOrder).subscribe(
      createdOrder => {
        // Mettre à jour les dates de maintenance
        maintenance.lastExecutionDate = new Date();
        maintenance.nextExecutionDate = this.calculateNextMaintenanceDate(maintenance.frequency);
        this.equipmentService.updateEquipment(equipment).subscribe();
      }
    );
  }

  private calculateEndDate(maintenance: PreventiveMaintenance): Date {
    const totalDuration = maintenance.tasks.reduce((sum, task) => sum + task.estimatedDuration, 0);
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + totalDuration);
    return endDate;
  }

  private calculateNextMaintenanceDate(frequency: string): Date {
    const date = new Date();
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'biannual':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'annual':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date;
  }

  addPreventiveMaintenance(equipment: Equipment, maintenance: PreventiveMaintenance): Observable<Equipment> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'maintenance_chief') {
      throw new Error('Seul le chef de maintenance peut configurer la maintenance préventive');
    }

    if (!equipment.preventiveMaintenance) {
      equipment.preventiveMaintenance = [];
    }
    equipment.preventiveMaintenance.push(maintenance);
    return this.equipmentService.updateEquipment(equipment);
  }

  updatePreventiveMaintenance(
    equipment: Equipment,
    maintenanceId: number,
    updates: Partial<PreventiveMaintenance>
  ): Observable<Equipment> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'maintenance_chief') {
      throw new Error('Seul le chef de maintenance peut modifier la maintenance préventive');
    }

    if (!equipment.preventiveMaintenance) {
      throw new Error('Aucune maintenance préventive configurée pour cet équipement');
    }

    const index = equipment.preventiveMaintenance.findIndex(m => m.id === maintenanceId);
    if (index === -1) {
      throw new Error('Maintenance préventive non trouvée');
    }

    equipment.preventiveMaintenance[index] = {
      ...equipment.preventiveMaintenance[index],
      ...updates
    };

    return this.equipmentService.updateEquipment(equipment);
  }

  deletePreventiveMaintenance(equipment: Equipment, maintenanceId: number): Observable<Equipment> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'maintenance_chief') {
      throw new Error('Seul le chef de maintenance peut supprimer la maintenance préventive');
    }

    if (!equipment.preventiveMaintenance) {
      throw new Error('Aucune maintenance préventive configurée pour cet équipement');
    }

    equipment.preventiveMaintenance = equipment.preventiveMaintenance.filter(m => m.id !== maintenanceId);
    return this.equipmentService.updateEquipment(equipment);
  }
}
