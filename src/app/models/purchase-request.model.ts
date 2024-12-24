export type PurchaseRequestStatus = 'pending' | 'approved' | 'rejected' | 'ordered' | 'received';

    export interface PurchaseRequest {
      id: number;
      item: string;
      quantity: number;
      requestedBy: string;
      description: string;
      status: PurchaseRequestStatus;
    }
