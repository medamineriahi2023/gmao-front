import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkOrder, WorkOrderStatus, WorkOrderType, MaintenanceTypeData } from '../models/work-order.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private workOrders: WorkOrder[] = [
    {
      id: 1,
      type: 'preventive',
      status: 'planned',
      priority: 'medium',
      equipmentId: 1,
      title: 'Maintenance préventive - Chargeuse',
      description: 'Maintenance périodique de la chargeuse compacte',
      plannedStartDate: new Date('2024-02-15'),
      plannedEndDate: new Date('2024-02-15'),
      assignedTechnicianId: 1,
      estimatedCost: 850,
      parts: [
        {
          id: 1,
          name: 'Filtre à huile',
          quantity: 1,
          unitCost: 45,
          totalCost: 45
        },
        {
          id: 2,
          name: 'Huile moteur',
          quantity: 5,
          unitCost: 12,
          totalCost: 60
        }
      ],
      tasks: [
        {
          id: 1,
          description: 'Vidange huile moteur',
          status: 'pending',
          estimatedDuration: 60,
          technicianNotes: '',
          category: 'repair',
          requiredSkills: ['mécanique'],
          safetyInstructions: ['Porter des gants', 'Vérifier que le moteur est froid']
        },
        {
          id: 2,
          description: 'Remplacement filtres',
          status: 'pending',
          estimatedDuration: 30,
          technicianNotes: '',
          category: 'replacement',
          requiredSkills: ['mécanique'],
          safetyInstructions: ['Porter des gants']
        }
      ],
      comments: [],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      maintenanceData: {
        type: 'preventive',
        data: {
          frequency: 'monthly',
          lastMaintenanceDate: new Date(),
          nextMaintenanceDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          checklistItems: []
        }
      }
    },
    {
      id: 2,
      type: 'corrective',
      status: 'in_progress',
      priority: 'high',
      equipmentId: 2,
      title: 'Réparation - Tondeuse',
      description: 'Problème de démarrage sur la tondeuse autoportée',
      plannedStartDate: new Date('2024-02-10'),
      plannedEndDate: new Date('2024-02-10'),
      actualStartDate: new Date('2024-02-10'),
      assignedTechnicianId: 2,
      estimatedCost: 350,
      parts: [],
      tasks: [
        {
          id: 3,
          description: 'Diagnostic système démarrage',
          status: 'completed',
          estimatedDuration: 45,
          actualDuration: 30,
          technicianNotes: 'Batterie défectueuse',
          category: 'testing',
          requiredSkills: ['électricité'],
          safetyInstructions: ['Couper le contact', 'Débrancher la batterie']
        },
        {
          id: 4,
          description: 'Remplacement batterie',
          status: 'in_progress',
          estimatedDuration: 30,
          technicianNotes: '',
          category: 'replacement',
          requiredSkills: ['électricité'],
          safetyInstructions: ['Porter des gants isolants', 'Vérifier l\'absence de tension']
        }
      ],
      comments: [
        {
          id: 1,
          author: 'Pierre Durant',
          content: 'Batterie complètement déchargée, remplacement nécessaire',
          createdAt: new Date('2024-02-10T10:30:00')
        }
      ],
      createdAt: new Date('2024-02-09'),
      updatedAt: new Date('2024-02-10'),
      maintenanceData: {
        type: 'corrective',
        data: {
          breakdownDate: new Date(),
          breakdownDescription: '',
          impactLevel: 'medium',
          rootCause: '',
          solutionApplied: '',
          preventiveMeasures: ''
        }
      }
    }
  ];

  private workOrdersSubject = new BehaviorSubject<WorkOrder[]>(this.workOrders);

  constructor(private authService: AuthService) {}

  getWorkOrders(): Observable<WorkOrder[]> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return of([]);
    }

    // If user is a technician, only return their assigned work orders
    if (currentUser.role === 'technician') {
      return this.workOrdersSubject.pipe(
        map(orders => orders.filter(order => order.assignedTechnicianId === currentUser.id))
      );
    }

    // For other roles (maintenance_chief, etc.), return all work orders
    return this.workOrdersSubject.asObservable();
  }

  getWorkOrderById(id: number): Observable<WorkOrder | undefined> {
    const currentUser = this.authService.getCurrentUser();
    
    return of(this.workOrders.find(wo => {
      // If user is a technician, only allow access to their assigned work orders
      if (currentUser?.role === 'technician') {
        return wo.id === id && wo.assignedTechnicianId === currentUser.id;
      }
      return wo.id === id;
    }));
  }

  createWorkOrder(workOrder: Partial<WorkOrder>): Observable<WorkOrder> {
    const newWorkOrder: WorkOrder = {
      id: Math.max(0, ...this.workOrders.map(wo => wo.id)) + 1,
      type: workOrder.type || 'preventive',
      status: 'draft',
      priority: workOrder.priority || 'medium',
      equipmentId: workOrder.equipmentId || 0,
      title: workOrder.title || '',
      description: workOrder.description || '',
      plannedStartDate: workOrder.plannedStartDate || new Date(),
      plannedEndDate: workOrder.plannedEndDate || new Date(),
      assignedTechnicianId: workOrder.assignedTechnicianId || 0,
      estimatedCost: workOrder.estimatedCost || 0,
      parts: [],
      tasks: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      maintenanceData: this.initializeMaintenanceData(workOrder.type || 'preventive')
    };
    
    this.workOrders.push(newWorkOrder);
    this.workOrdersSubject.next(this.workOrders);
    return of(newWorkOrder);
  }

  private initializeMaintenanceData(type: WorkOrderType): MaintenanceTypeData {
    switch (type) {
      case 'preventive':
        return {
          type: 'preventive',
          data: {
            frequency: 'monthly',
            lastMaintenanceDate: new Date(),
            nextMaintenanceDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            checklistItems: []
          }
        };
      
      case 'corrective':
        return {
          type: 'corrective',
          data: {
            breakdownDate: new Date(),
            breakdownDescription: '',
            impactLevel: 'medium',
            rootCause: '',
            solutionApplied: '',
            preventiveMeasures: ''
          }
        };
      
      case 'conditional':
        return {
          type: 'conditional',
          data: {
            triggerCondition: '',
            measurementValues: [],
            sensorData: []
          }
        };
    }
  }

  updateWorkOrder(workOrder: WorkOrder): Observable<WorkOrder> {
    const index = this.workOrders.findIndex(wo => wo.id === workOrder.id);
    if (index !== -1) {
      // Mise à jour des dates de maintenance pour la maintenance préventive
      if (workOrder.type === 'preventive' && workOrder.maintenanceData?.type === 'preventive') {
        const preventiveData = workOrder.maintenanceData.data;
        if (workOrder.status === 'completed' && !preventiveData.lastMaintenanceDate) {
          preventiveData.lastMaintenanceDate = new Date();
          // Calculer la prochaine date de maintenance en fonction de la fréquence
          const nextDate = new Date();
          switch (preventiveData.frequency) {
            case 'daily':
              nextDate.setDate(nextDate.getDate() + 1);
              break;
            case 'weekly':
              nextDate.setDate(nextDate.getDate() + 7);
              break;
            case 'monthly':
              nextDate.setMonth(nextDate.getMonth() + 1);
              break;
            case 'quarterly':
              nextDate.setMonth(nextDate.getMonth() + 3);
              break;
            case 'biannual':
              nextDate.setMonth(nextDate.getMonth() + 6);
              break;
            case 'annual':
              nextDate.setFullYear(nextDate.getFullYear() + 1);
              break;
          }
          preventiveData.nextMaintenanceDate = nextDate;
        }
      }

      this.workOrders[index] = {
        ...workOrder,
        updatedAt: new Date()
      };
      this.workOrdersSubject.next(this.workOrders);
      return of(this.workOrders[index]);
    }
    throw new Error('Bon de travail non trouvé');
  }

  deleteWorkOrder(id: number): Observable<boolean> {
    const index = this.workOrders.findIndex(wo => wo.id === id);
    if (index !== -1) {
      this.workOrders.splice(index, 1);
      this.workOrdersSubject.next(this.workOrders);
      return of(true);
    }
    return of(false);
  }

  assignTechnician(workOrderId: number, technicianId: number): Observable<WorkOrder> {
    const workOrder = this.workOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) {
      throw new Error('Bon de travail non trouvé');
    }

    workOrder.assignedTechnicianId = technicianId;
    workOrder.updatedAt = new Date();
    this.workOrdersSubject.next(this.workOrders);
    return of(workOrder);
  }

  updateStatus(workOrderId: number, status: WorkOrderStatus): Observable<WorkOrder> {
    const workOrder = this.workOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) {
      throw new Error('Bon de travail non trouvé');
    }

    workOrder.status = status;
    workOrder.updatedAt = new Date();
    
    // Si le statut passe à "in_progress", on définit la date de début réelle
    if (status === 'in_progress' && !workOrder.actualStartDate) {
      workOrder.actualStartDate = new Date();
    }
    
    // Si le statut passe à "completed", on définit la date de fin réelle
    if (status === 'completed' && !workOrder.actualEndDate) {
      workOrder.actualEndDate = new Date();
    }

    this.workOrdersSubject.next(this.workOrders);
    return of(workOrder);
  }
}
