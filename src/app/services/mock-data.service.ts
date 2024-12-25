import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Equipment } from '../models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockEquipments: Equipment[] = [
    {
      id: 1,
      name: 'Chariot élévateur CAT-2000',
      type: 'Chariot élévateur',
      serialNumber: 'CAT2000-123',
      status: 'operational',
      location: {
        site: 'Site Principal',
        building: 'Entrepôt A',
        department: 'Logistique'
      },
      category: {
        family: 'Manutention',
        subFamily: 'Chariots élévateurs'
      },
      technicalDetails: {
        manufacturer: 'CaterpillarPro',
        model: 'CAT-2000',
        yearOfManufacture: 2020,
        specifications: {
          'Capacité de levage': '2000 kg',
          'Hauteur de levage': '4.5 m',
          'Type de moteur': 'Électrique'
        }
      },
      documents: [],
      maintenanceHistory: [],
      totalMaintenanceCost: 0,
      lastMaintenanceDate: new Date('2023-12-01'),
      nextMaintenanceDate: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Système de ventilation GV-500',
      type: 'Ventilation',
      serialNumber: 'GV500-456',
      status: 'maintenance',
      location: {
        site: 'Site Secondaire',
        building: 'Bâtiment B',
        department: 'Production'
      },
      category: {
        family: 'HVAC',
        subFamily: 'Ventilation'
      },
      technicalDetails: {
        manufacturer: 'GreenMaster',
        model: 'GV-500',
        yearOfManufacture: 2021,
        specifications: {
          'Débit d\'air': '500 m³/h',
          'Puissance': '2.5 kW',
          'Niveau sonore': '65 dB'
        }
      },
      documents: [],
      maintenanceHistory: [],
      totalMaintenanceCost: 0,
      lastMaintenanceDate: new Date('2023-11-15'),
      nextMaintenanceDate: new Date('2024-02-15')
    }
  ];

  getEquipments(): Observable<Equipment[]> {
    return of(this.mockEquipments);
  }

  getEquipmentById(id: number): Observable<Equipment | undefined> {
    return of(this.mockEquipments.find(eq => eq.id === id));
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    equipment.id = Math.max(...this.mockEquipments.map(e => e.id)) + 1;
    this.mockEquipments.push(equipment);
    return of(equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    const index = this.mockEquipments.findIndex(eq => eq.id === equipment.id);
    if (index !== -1) {
      this.mockEquipments[index] = equipment;
    }
    return of(equipment);
  }

  deleteEquipment(id: number): Observable<boolean> {
    const index = this.mockEquipments.findIndex(eq => eq.id === id);
    if (index !== -1) {
      this.mockEquipments.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
