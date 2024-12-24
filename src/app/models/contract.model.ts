export type ContractStatus = 'active' | 'expired' | 'pending' | 'terminated';
export type ContractType = 'maintenance' | 'inspection' | 'support' | 'service' | 'other';

export interface Contract {
  id: number;
  reference: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  provider: {
    name: string;
    contact: string;
    email: string;
    phone: string;
  };
  startDate: Date;
  endDate: Date;
  value: number;
  description: string;
  obligations: ContractObligation[];
  documents: ContractDocument[];
  renewalNotice: number; // Nombre de jours avant expiration pour notification
  autoRenewal: boolean;
  lastRenewalDate?: Date;
  nextRenewalDate?: Date;
}

export interface ContractObligation {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  frequency: 'once' | 'monthly' | 'quarterly' | 'yearly';
  lastCompletionDate?: Date;
  nextDueDate?: Date;
}

export interface ContractDocument {
  id: number;
  name: string;
  type: 'contract' | 'amendment' | 'invoice' | 'report' | 'other';
  uploadDate: Date;
  url: string;
}
