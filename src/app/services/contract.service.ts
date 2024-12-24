import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Contract } from '../models/contract.model';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private contracts: Contract[] = [
    {
      id: 1,
      reference: 'MAINT-2024-001',
      title: 'Contrat de maintenance préventive - Chargeuses',
      type: 'maintenance',
      status: 'active',
      provider: {
        name: 'TechnoMaintenance SARL',
        contact: 'Jean Martin',
        email: 'j.martin@technomaintenance.fr',
        phone: '01 23 45 67 89'
      },
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      value: 24000,
      description: 'Maintenance préventive trimestrielle des chargeuses',
      obligations: [
        {
          id: 1,
          title: 'Inspection trimestrielle',
          description: 'Inspection complète et maintenance préventive',
          dueDate: new Date('2024-03-31'),
          completed: false,
          frequency: 'quarterly',
          nextDueDate: new Date('2024-03-31')
        }
      ],
      documents: [
        {
          id: 1,
          name: 'Contrat signé',
          type: 'contract',
          uploadDate: new Date('2023-12-15'),
          url: '/documents/MAINT-2024-001/contract.pdf'
        }
      ],
      renewalNotice: 60,
      autoRenewal: true
    }
  ];

  private contractsSubject = new BehaviorSubject<Contract[]>(this.contracts);

  getContracts(): Observable<Contract[]> {
    return this.contractsSubject.asObservable();
  }

  getContractById(id: number): Observable<Contract | undefined> {
    return of(this.contracts.find(c => c.id === id));
  }

  createContract(contract: Partial<Contract>): Observable<Contract> {
    const newContract: Contract = {
      id: Math.max(0, ...this.contracts.map(c => c.id)) + 1,
      obligations: [],
      documents: [],
      ...contract
    } as Contract;
    
    this.contracts.push(newContract);
    this.contractsSubject.next(this.contracts);
    return of(newContract);
  }

  updateContract(contract: Contract): Observable<Contract> {
    const index = this.contracts.findIndex(c => c.id === contract.id);
    if (index !== -1) {
      this.contracts[index] = contract;
      this.contractsSubject.next(this.contracts);
      return of(contract);
    }
    throw new Error('Contract not found');
  }

  deleteContract(id: number): Observable<boolean> {
    const index = this.contracts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contracts.splice(index, 1);
      this.contractsSubject.next(this.contracts);
      return of(true);
    }
    return of(false);
  }

  getExpiringContracts(days: number): Observable<Contract[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return of(this.contracts.filter(contract => {
      const endDate = new Date(contract.endDate);
      return endDate >= today && endDate <= futureDate;
    }));
  }
}
