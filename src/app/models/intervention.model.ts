export type InterventionType = 'curative' | 'preventive' | 'conditional';
export type InterventionStatus = 'draft' | 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
export type InterventionPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Intervention {
  id: number;
  type: InterventionType;
  equipmentId: number;
  description: string;
  priority: InterventionPriority;
  status: InterventionStatus;
  reportedBy: string;
  reportedAt: Date;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  assignedTechnicians: string[];
  usageParameters?: {
    mileage?: number;
    operatingHours?: number;
    lastInspectionDate?: Date;
  };
  parts: InterventionPart[];
  tasks: InterventionTask[];
  comments: InterventionComment[];
}

export interface InterventionPart {
  id: number;
  name: string;
  quantity: number;
  stockAvailable: number;
  unitCost: number;
}

export interface InterventionTask {
  id: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  estimatedDuration: number;
  actualDuration?: number;
  technicianNotes?: string;
}

export interface InterventionComment {
  id: number;
  author: string;
  content: string;
  createdAt: Date;
}
