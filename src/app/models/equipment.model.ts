export type EquipmentStatus = 'operational' | 'maintenance' | 'repair' | 'out_of_service';
export type DocumentType = 'Manuel' | 'Fiche technique' | 'Procédure' | 'Autre';

export interface Location {
  site: string;
  building: string;
  department: string;
}

export interface Category {
  family: string;
  subFamily: string;
}

export interface TechnicalDetails {
  manufacturer: string;
  model: string;
  yearOfManufacture: number;
  specifications: Record<string, string>;
}

export interface MaintenanceRecord {
  id: number;
  date: Date;
  type: string;
  description: string;
  cost: number;
  technician: string;
}

export interface Document {
  id: number;
  name: string;
  type: DocumentType;
  path: string;
  uploadDate: Date;
}

export interface PreventiveMaintenance {
  id: number;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'annual';
  assignedTechnicianId: number;
  lastExecutionDate?: Date;
  nextExecutionDate: Date;
  tasks: {
    description: string;
    estimatedDuration: number;
  }[];
  active: boolean;
}

export interface Equipment {
  id: number;
  name: string;
  type: string;
  serialNumber: string;
  status: EquipmentStatus;
  location: Location;
  category: Category;
  technicalDetails: TechnicalDetails;
  documents: Document[];
  maintenanceHistory: MaintenanceRecord[];
  totalMaintenanceCost: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  preventiveMaintenance?: PreventiveMaintenance[];
}
