export type PurchaseRequestStatus = 'pending' | 'approved' | 'ordered' | 'received' | 'rejected';

export interface PurchaseRequest {
  id?: number;
  workOrderId: number;
  item: string;
  quantity: number;
  description: string;
  requestedBy: string;
  status: PurchaseRequestStatus;
  estimatedCost?: number;
  actualCost?: number;
  supplier?: string;
  orderReference?: string;
  
  // Informations d'approbation
  approvedBy?: string;
  approvedAt?: Date;
  
  // Informations de commande
  orderedBy?: string;
  orderedAt?: Date;
  
  // Informations de réception
  receivedBy?: string;
  receivedAt?: Date;
  
  // Informations de rejet
  rejectedBy?: string;
  rejectedAt?: Date;
  
  // Dates de création et mise à jour
  createdAt: Date;
  updatedAt: Date;
}
