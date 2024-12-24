import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Equipment, MaintenanceRecord } from '../models/equipment.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  constructor(private mockDataService: MockDataService) {}

  scheduleMaintenance(equipment: Equipment, maintenance: MaintenanceRecord): Observable<Equipment> {
    // Ajoute la maintenance à l'historique
    equipment.maintenanceHistory = [...equipment.maintenanceHistory, maintenance];
    
    // Met à jour les dates de maintenance
    equipment.lastMaintenanceDate = maintenance.date;
    equipment.nextMaintenanceDate = new Date(maintenance.date);
    equipment.nextMaintenanceDate.setMonth(equipment.nextMaintenanceDate.getMonth() + 6);
    
    // Met à jour le coût total
    equipment.totalMaintenanceCost += maintenance.cost;
    
    // Met à jour l'équipement
    return this.mockDataService.updateEquipment(equipment);
  }
}
