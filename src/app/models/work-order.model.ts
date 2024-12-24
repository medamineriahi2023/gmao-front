export type WorkOrderType = 'corrective' | 'preventive';
export type WorkOrderStatus = 'draft' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkOrder {
  id: number;
  type: WorkOrderType;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  equipmentId: number;
  title: string;
  description: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  assignedTechnicians: string[];
  estimatedCost: number;
  actualCost?: number;
  parts: WorkOrderPart[];
  tasks: WorkOrderTask[];
  comments: WorkOrderComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderPart {
  id: number;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface WorkOrderTask {
  id: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  technicianNotes?: string;
}

export interface WorkOrderComment {
  id: number;
  author: string;
  content: string;
  createdAt: Date;
}
