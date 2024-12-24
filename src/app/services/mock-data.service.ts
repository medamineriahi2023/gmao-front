import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Equipment } from '../models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private equipments: Equipment[] = [
    {
      id: 1,
      name: 'Chargeuse Compacte',
      type: 'Engin de chantier',
      serialNumber: 'CC-2023-001',
      status: 'Fonctionnel',
      location: {
        site: 'Centre Technique Municipal',
        building: 'Garage Principal',
        department: 'Voirie'
      },
      category: {
        family: 'Véhicules',
        subFamily: 'Engins de chantier'
      },
      acquisition: {
        date: new Date('2023-01-15'),
        cost: 75000
      },
      technicalDetails: {
        manufacturer: 'CaterpillarPro',
        model: 'CP-2000',
        yearOfManufacture: 2023,
        specifications: {
          'Puissance': '74 kW',
          'Poids': '3500 kg',
          'Capacité': '0.8 m³'
        }
      },
      documents: [
        {
          id: 1,
          name: 'Manuel utilisateur',
          type: 'Manuel',
          url: '/docs/CC-2023-001/manual.pdf',
          uploadDate: new Date('2023-01-15')
        }
      ],
      maintenanceHistory: [
        {
          id: 1,
          date: new Date('2023-06-15'),
          type: 'Préventive',
          description: 'Révision des 500h',
          cost: 850,
          technician: 'Jean Dupont'
        }
      ],
      totalMaintenanceCost: 850,
      lastMaintenanceDate: new Date('2023-06-15'),
      nextMaintenanceDate: new Date('2023-12-15')
    },
    {
      id: 2,
      name: 'Tondeuse Autoportée',
      type: 'Matériel d\'entretien',
      serialNumber: 'TA-2023-002',
      status: 'En maintenance',
      location: {
        site: 'Parc Municipal',
        building: 'Local Technique',
        department: 'Espaces Verts'
      },
      category: {
        family: 'Matériel d\'entretien',
        subFamily: 'Tondeuses'
      },
      acquisition: {
        date: new Date('2023-03-20'),
        cost: 12000
      },
      technicalDetails: {
        manufacturer: 'GreenMaster',
        model: 'GM-500',
        yearOfManufacture: 2023,
        specifications: {
          'Puissance': '18.5 kW',
          'Largeur de coupe': '122 cm'
        }
      },
      documents: [
        {
          id: 2,
          name: 'Manuel technique',
          type: 'Manuel',
          url: '/docs/TA-2023-002/manual.pdf',
          uploadDate: new Date('2023-03-20')
        }
      ],
      maintenanceHistory: [],
      totalMaintenanceCost: 0
    }
  ];

  getEquipments(): Observable<Equipment[]> {
    return of(this.equipments);
  }

  getEquipmentById(id: number): Observable<Equipment | undefined> {
    return of(this.equipments.find(eq => eq.id === id));
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    equipment.id = Math.max(...this.equipments.map(e => e.id)) + 1;
    this.equipments.push(equipment);
    return of(equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    const index = this.equipments.findIndex(eq => eq.id === equipment.id);
    if (index !== -1) {
      this.equipments[index] = equipment;
    }
    return of(equipment);
  }

  deleteEquipment(id: number): Observable<boolean> {
    const index = this.equipments.findIndex(eq => eq.id === id);
    if (index !== -1) {
      this.equipments.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
