import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Equipment } from '../../models/equipment.model';
import { EquipmentFilters } from '../../models/equipment-filters.model';
import { MockDataService } from '../../services/mock-data.service';
import { MaintenanceService } from '../../services/maintenance.service';
import { EquipmentFiltersComponent } from '../equipment/equipment-filters/equipment-filters.component';
import { EquipmentGridComponent } from '../equipment/equipment-grid/equipment-grid.component';
import { EquipmentTableComponent } from '../equipment/equipment-table/equipment-table.component';
import { EquipmentFormDialogComponent } from '../equipment/dialogs/equipment-form-dialog.component';
import { EquipmentDetailsDialogComponent } from '../equipment/dialogs/equipment-details-dialog.component';
import { MaintenanceDialogComponent } from '../equipment/maintenance-dialog/maintenance-dialog.component';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    EquipmentFiltersComponent,
    EquipmentGridComponent,
    EquipmentTableComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Gestion des Équipements</h1>
          <p class="subtitle">Inventaire et suivi des équipements municipaux</p>
        </div>
        <button mat-raised-button color="primary" (click)="openEquipmentForm()">
          <mat-icon>add</mat-icon>
          Nouvel Équipement
        </button>
      </div>

      <app-equipment-filters
        (onFiltersChange)="handleFiltersChange($event)"
        (onViewChange)="currentView = $event">
      </app-equipment-filters>

      <ng-container [ngSwitch]="currentView">
        <app-equipment-grid
          *ngSwitchCase="'grid'"
          [equipments]="filteredEquipments"
          (onView)="viewDetails($event)"
          (onEdit)="editEquipment($event)"
          (onDelete)="deleteEquipment($event)"
          (onMaintenance)="scheduleMaintenanceDialog($event)">
        </app-equipment-grid>

        <app-equipment-table
          *ngSwitchCase="'list'"
          [equipments]="filteredEquipments"
          (onView)="viewDetails($event)"
          (onEdit)="editEquipment($event)"
          (onDelete)="deleteEquipment($event)"
          (onMaintenance)="scheduleMaintenanceDialog($event)">
        </app-equipment-table>
      </ng-container>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-content h1 {
      margin: 0;
      font-size: 24px;
      color: #1a1a1a;
    }

    .subtitle {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
    }

    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class EquipmentListComponent implements OnInit {
  equipments: Equipment[] = [];
  filteredEquipments: Equipment[] = [];
  currentView: 'grid' | 'list' = 'grid';

  constructor(
    private mockDataService: MockDataService,
    private maintenanceService: MaintenanceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEquipments();
  }

  loadEquipments() {
    this.mockDataService.getEquipments().subscribe(data => {
      this.equipments = data;
      this.filteredEquipments = data;
    });
  }

  handleFiltersChange(filters: EquipmentFilters) {
    this.filteredEquipments = this.equipments.filter(equipment => {
      const matchesSearch = !filters.search || 
        equipment.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.serialNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.location.site.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.statuses.length === 0 || 
        filters.statuses.includes(equipment.status);

      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(equipment.category.family);

      const matchesSite = filters.sites.length === 0 || 
        filters.sites.includes(equipment.location.site);

      const matchesDateRange = !filters.maintenanceDateRange.start || !filters.maintenanceDateRange.end ||
        (equipment.lastMaintenanceDate &&
          equipment.lastMaintenanceDate >= filters.maintenanceDateRange.start &&
          equipment.lastMaintenanceDate <= filters.maintenanceDateRange.end);

      return matchesSearch && matchesStatus && matchesCategory && matchesSite && matchesDateRange;
    });
  }

  openEquipmentForm() {
    const dialogRef = this.dialog.open(EquipmentFormDialogComponent, {
      width: '800px',
      data: { equipment: null }
    });

    dialogRef.afterClosed().subscribe(equipmentData => {
      if (equipmentData) {
        this.mockDataService.addEquipment(equipmentData as Equipment).subscribe(equipment => {
          this.loadEquipments();
          this.snackBar.open('Équipement ajouté avec succès', 'Fermer', {
            duration: 3000
          });
        });
      }
    });
  }

  viewDetails(equipment: Equipment) {
    this.dialog.open(EquipmentDetailsDialogComponent, {
      width: '800px',
      data: { equipment }
    });
  }

  editEquipment(equipment: Equipment) {
    const dialogRef = this.dialog.open(EquipmentFormDialogComponent, {
      width: '800px',
      data: { equipment }
    });

    dialogRef.afterClosed().subscribe(equipmentData => {
      if (equipmentData) {
        this.mockDataService.updateEquipment({ ...equipment, ...equipmentData }).subscribe(updated => {
          this.loadEquipments();
          this.snackBar.open('Équipement modifié avec succès', 'Fermer', {
            duration: 3000
          });
        });
      }
    });
  }

  deleteEquipment(equipment: Equipment) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      this.mockDataService.deleteEquipment(equipment.id).subscribe(success => {
        if (success) {
          this.loadEquipments();
          this.snackBar.open('Équipement supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  scheduleMaintenanceDialog(equipment: Equipment) {
    const dialogRef = this.dialog.open(MaintenanceDialogComponent, {
      width: '500px',
      data: { equipment }
    });

    dialogRef.afterClosed().subscribe(maintenance => {
      if (maintenance) {
        this.maintenanceService.scheduleMaintenance(equipment, maintenance).subscribe(updatedEquipment => {
          this.loadEquipments();
          this.snackBar.open('Maintenance planifiée avec succès', 'Fermer', {
            duration: 3000
          });
        });
      }
    });
  }
}
