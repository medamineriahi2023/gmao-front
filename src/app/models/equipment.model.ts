export type EquipmentStatus = 'Fonctionnel' | 'En panne' | 'À remplacer' | 'En maintenance';
export type DocumentType = 'Manuel' | 'Fiche technique' | 'Procédure' | 'Autre';

export interface MaintenanceRecord {
  id: number;
  date: Date;
  type: 'Préventive' | 'Curative';
  description: string;
  cost: number;
  technician: string;
}

export interface TechnicalDocument {
  id: number;
  name: string;
  type: DocumentType;
  url: string;
  uploadDate: Date;
}

export interface Equipment {
  id: number;
  name: string;
  type: string;
  serialNumber: string;
  status: EquipmentStatus;
  location: {
    site: string;
    building: string;
    department: string;
  };
  category: {
    family: string;
    subFamily: string;
  };
  acquisition: {
    date: Date;
    cost: number;
  };
  technicalDetails: {
    manufacturer: string;
    model: string;
    yearOfManufacture: number;
    specifications: Record<string, string>;
  };
  documents: TechnicalDocument[];
  maintenanceHistory: MaintenanceRecord[];
  totalMaintenanceCost: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
}
