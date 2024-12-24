import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { WorkOrder } from '../models/work-order.model';

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
      assignedTechnicians: ['Jean Dupont', 'Marie Martin'],
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
          technicianNotes: ''
        },
        {
          id: 2,
          description: 'Remplacement filtres',
          status: 'pending',
          estimatedDuration: 30,
          technicianNotes: ''
        }
      ],
      comments: [],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
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
      assignedTechnicians: ['Pierre Durant'],
      estimatedCost: 350,
      parts: [],
      tasks: [
        {
          id: 3,
          description: 'Diagnostic système démarrage',
          status: 'completed',
          estimatedDuration: 45,
          actualDuration: 30,
          technicianNotes: 'Batterie défectueuse'
        },
        {
          id: 4,
          description: 'Remplacement batterie',
          status: 'in_progress',
          estimatedDuration: 30,
          technicianNotes: ''
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
      updatedAt: new Date('2024-02-10')
    }
  ];

  private workOrdersSubject = new BehaviorSubject<WorkOrder[]>(this.workOrders);

  getWorkOrders(): Observable<WorkOrder[]> {
    return this.workOrdersSubject.asObservable();
  }

  getWorkOrderById(id: number): Observable<WorkOrder | undefined> {
    return of(this.workOrders.find(wo => wo.id === id));
  }

  createWorkOrder(workOrder: Partial<WorkOrder>): Observable<WorkOrder> {
    const newWorkOrder: WorkOrder = {
      id: Math.max(0, ...this.workOrders.map(wo => wo.id)) + 1,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      parts: [],
      tasks: [],
      comments: [],
      ...workOrder
    } as WorkOrder;
    
    this.workOrders.push(newWorkOrder);
    this.workOrdersSubject.next(this.workOrders);
    return of(newWorkOrder);
  }

  updateWorkOrder(workOrder: WorkOrder): Observable<WorkOrder> {
    const index = this.workOrders.findIndex(wo => wo.id === workOrder.id);
    if (index !== -1) {
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
}
