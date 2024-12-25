export type WorkOrderType = 'corrective' | 'preventive' | 'conditional';
export type WorkOrderStatus = 'draft' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'annual';

// Interface de base pour les bons de travail
export interface BaseWorkOrder {
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
  assignedTechnicianId: number;
  estimatedCost: number;
  actualCost?: number;
  parts: WorkOrderPart[];
  tasks: WorkOrderTask[];
  comments: WorkOrderComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Extension pour la maintenance préventive
export interface PreventiveMaintenanceData {
  frequency: MaintenanceFrequency;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  checklistItems: {
    id: number;
    description: string;
    isCompleted: boolean;
  }[];
}

// Extension pour la maintenance corrective
export interface CorrectiveMaintenanceData {
  breakdownDate: Date;
  breakdownDescription: string;
  impactLevel: 'low' | 'medium' | 'high';
  rootCause?: string;
  solutionApplied?: string;
  preventiveMeasures?: string;
}

// Extension pour la maintenance conditionnelle
export interface ConditionalMaintenanceData {
  triggerCondition: string;
  measurementValues: {
    name: string;
    value: number;
    unit: string;
    threshold: number;
    timestamp: Date;
  }[];
  sensorData?: {
    sensorId: string;
    readings: {
      value: number;
      timestamp: Date;
    }[];
  }[];
}

// Type union pour les données spécifiques au type de maintenance
export type MaintenanceTypeData = 
  | { type: 'preventive'; data: PreventiveMaintenanceData }
  | { type: 'corrective'; data: CorrectiveMaintenanceData }
  | { type: 'conditional'; data: ConditionalMaintenanceData };

// Interface complète du bon de travail
export interface WorkOrder extends BaseWorkOrder {
  maintenanceData?: MaintenanceTypeData;
}

export interface WorkOrderPart {
  id: number;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  stockLevel?: number;
  minimumStock?: number;
  supplier?: string;
  deliveryTime?: number; // en jours
}

export interface WorkOrderTask {
  id: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  estimatedDuration: number; // en minutes
  actualDuration?: number;
  technicianNotes?: string;
  category: 'inspection' | 'repair' | 'replacement' | 'testing';
  requiredSkills: string[];
  safetyInstructions: string[];
  toolsRequired?: string[];
  prerequisites?: string[];
}

export interface WorkOrderComment {
  id: number;
  author: string;
  content: string;
  createdAt: Date;
  attachments?: {
    id: number;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  isInternal?: boolean; // Pour différencier les commentaires internes des communications avec les clients
  relatedTaskId?: number;
}
