import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Intervention, InterventionType, InterventionStatus } from '../models/intervention.model';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private interventions: Intervention[] = [];
  private interventionsSubject = new BehaviorSubject<Intervention[]>([]);

  getInterventions(): Observable<Intervention[]> {
    return this.interventionsSubject.asObservable();
  }

  getInterventionsByEquipment(equipmentId: number): Observable<Intervention[]> {
    return of(this.interventions.filter(i => i.equipmentId === equipmentId));
  }

  getInterventionsByType(type: InterventionType): Observable<Intervention[]> {
    return of(this.interventions.filter(i => i.type === type));
  }

  getInterventionsByStatus(status: InterventionStatus): Observable<Intervention[]> {
    return of(this.interventions.filter(i => i.status === status));
  }

  createIntervention(intervention: Partial<Intervention>): Observable<Intervention> {
    const newIntervention: Intervention = {
      id: Math.max(0, ...this.interventions.map(i => i.id)) + 1,
      reportedAt: new Date(),
      status: 'planned',
      assignedTechnicians: [],
      parts: [],
      tasks: [],
      comments: [],
      ...intervention
    } as Intervention;
    
    this.interventions.push(newIntervention);
    this.interventionsSubject.next(this.interventions);
    return of(newIntervention);
  }

  updateIntervention(intervention: Intervention): Observable<Intervention> {
    const index = this.interventions.findIndex(i => i.id === intervention.id);
    if (index !== -1) {
      this.interventions[index] = intervention;
      this.interventionsSubject.next(this.interventions);
      return of(intervention);
    }
    throw new Error('Intervention not found');
  }

  deleteIntervention(id: number): Observable<boolean> {
    const index = this.interventions.findIndex(i => i.id === id);
    if (index !== -1) {
      this.interventions.splice(index, 1);
      this.interventionsSubject.next(this.interventions);
      return of(true);
    }
    return of(false);
  }

  validateIntervention(id: number, approved: boolean): Observable<Intervention> {
    const intervention = this.interventions.find(i => i.id === id);
    if (intervention) {
      intervention.status = approved ? 'approved' : 'rejected';
      this.interventionsSubject.next(this.interventions);
      return of(intervention);
    }
    throw new Error('Intervention not found');
  }
}
