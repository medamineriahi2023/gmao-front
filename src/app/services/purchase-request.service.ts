import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PurchaseRequest, PurchaseRequestStatus } from '../models/purchase-request.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestService {
  private mockPurchaseRequests: PurchaseRequest[] = [
    {
      id: 1,
      workOrderId: 1,
      item: 'Roulement SKF 6205',
      quantity: 2,
      description: 'Roulement à billes pour moteur principal',
      requestedBy: 'Jean Dupont',
      status: 'pending',
      estimatedCost: 45.99,
      supplier: 'SKF Distribution',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      workOrderId: 1,
      item: 'Courroie trapézoïdale',
      quantity: 1,
      description: 'Courroie de transmission pour ventilateur',
      requestedBy: 'Pierre Martin',
      status: 'approved',
      estimatedCost: 28.50,
      supplier: 'Gates Industrial',
      approvedBy: 'Marie Dubois',
      approvedAt: new Date('2024-01-16'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16')
    }
  ];

  constructor(private authService: AuthService) { }

  getPurchaseRequests(): Observable<PurchaseRequest[]> {
    return of(this.mockPurchaseRequests).pipe(delay(500));
  }

  getPurchaseRequestById(id: number): Observable<PurchaseRequest | undefined> {
    return of(this.mockPurchaseRequests.find(pr => pr.id === id)).pipe(delay(500));
  }

  getPurchaseRequestsByWorkOrder(workOrderId: number): Observable<PurchaseRequest[]> {
    return of(this.mockPurchaseRequests.filter(pr => pr.workOrderId === workOrderId)).pipe(delay(500));
  }

  addPurchaseRequest(request: Partial<PurchaseRequest>): Observable<PurchaseRequest> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to create a purchase request');
    }

    const now = new Date();
    const newId = Math.max(0, ...this.mockPurchaseRequests.map(pr => pr.id ?? 0)) + 1;
    
    const newRequest: PurchaseRequest = {
      id: newId,
      workOrderId: request.workOrderId!,
      item: request.item || '',
      quantity: request.quantity || 0,
      description: request.description || '',
      requestedBy: `${currentUser.firstName} ${currentUser.lastName}`,
      status: 'pending',
      estimatedCost: request.estimatedCost,
      supplier: request.supplier,
      createdAt: now,
      updatedAt: now
    };

    this.mockPurchaseRequests.push(newRequest);
    return of(newRequest).pipe(delay(500));
  }

  updatePurchaseRequest(request: PurchaseRequest): Observable<PurchaseRequest> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to update a purchase request');
    }

    const index = this.mockPurchaseRequests.findIndex(pr => pr.id === request.id);
    if (index === -1) {
      throw new Error('Purchase request not found');
    }

    const now = new Date();
    const updatedRequest: PurchaseRequest = {
      ...request,
      updatedAt: now
    };

    this.mockPurchaseRequests[index] = updatedRequest;
    return of(updatedRequest).pipe(delay(500));
  }

  updatePurchaseRequestStatus(request: PurchaseRequest, newStatus: PurchaseRequestStatus): Observable<PurchaseRequest> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to update a purchase request');
    }

    const now = new Date();
    const userName = `${currentUser.firstName} ${currentUser.lastName}`;
    let updatedRequest: PurchaseRequest = {
      ...request,
      status: newStatus,
      updatedAt: now
    };

    switch (newStatus) {
      case 'approved':
        updatedRequest = { ...updatedRequest, approvedBy: userName, approvedAt: now };
        break;
      case 'ordered':
        updatedRequest = { ...updatedRequest, orderedBy: userName, orderedAt: now };
        break;
      case 'received':
        updatedRequest = { ...updatedRequest, receivedBy: userName, receivedAt: now };
        break;
      case 'rejected':
        updatedRequest = { ...updatedRequest, rejectedBy: userName, rejectedAt: now };
        break;
    }

    const index = this.mockPurchaseRequests.findIndex(pr => pr.id === request.id);
    if (index !== -1) {
      this.mockPurchaseRequests[index] = updatedRequest;
    }

    return of(updatedRequest).pipe(delay(500));
  }
}
