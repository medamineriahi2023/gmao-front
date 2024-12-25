import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { PurchaseRequest } from '../models/purchase-request.model';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestService {
  private purchaseRequests: PurchaseRequest[] = [
    {
      id: 1,
      item: 'Filtre à huile',
      quantity: 2,
      requestedBy: 'tech1',
      description: 'Remplacement lors de la maintenance',
      status: 'pending'
    },
    {
      id: 2,
      item: 'Batterie 12V',
      quantity: 1,
      requestedBy: 'chief1',
      description: 'Batterie défectueuse',
      status: 'approved'
    }
  ];
  private purchaseRequestsSubject = new BehaviorSubject<PurchaseRequest[]>(this.purchaseRequests);

  constructor(private authService: AuthService) {}

  getPurchaseRequests(): Observable<PurchaseRequest[]> {
    return this.purchaseRequestsSubject.asObservable();
  }

  addPurchaseRequest(request: PurchaseRequest): Observable<PurchaseRequest> {
    const newRequest: PurchaseRequest = {
      ...request,
      id: Math.max(0, ...this.purchaseRequests.map(r => r.id)) + 1,
      status: 'pending'
    };
    this.purchaseRequests.push(newRequest);
    this.purchaseRequestsSubject.next(this.purchaseRequests);
    return of(newRequest);
  }

  updatePurchaseRequest(request: PurchaseRequest): Observable<PurchaseRequest> {
    const index = this.purchaseRequests.findIndex(r => r.id === request.id);
    if (index !== -1) {
      this.purchaseRequests[index] = request;
      this.purchaseRequestsSubject.next(this.purchaseRequests);
      return of(request);
    }
    throw new Error('Purchase request not found');
  }
}
