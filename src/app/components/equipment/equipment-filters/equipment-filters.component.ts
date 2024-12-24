import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentFilters } from '../../../models/equipment-filters.model';

@Component({
  selector: 'app-equipment-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatButtonModule
  ],
  template: `
    <div class="filters-container">
      <div class="search-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Rechercher un équipement</mat-label>
          <input matInput 
                 [formControl]="searchControl"
                 placeholder="Nom, numéro de série, localisation...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <mat-button-toggle-group class="view-toggle" value="grid">
          <mat-button-toggle value="grid" (click)="onViewChange.emit('grid')">
            <mat-icon>grid_view</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="list" (click)="onViewChange.emit('list')">
            <mat-icon>view_list</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <mat-accordion>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>filter_list</mat-icon>
              Filtres avancés
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="advanced-filters">
            <div class="filter-section">
              <h3>Statut</h3>
              <mat-chip-listbox 
                [multiple]="true"
                [formControl]="statusesControl">
                <mat-chip-option selected>Tous</mat-chip-option>
                <mat-chip-option value="Fonctionnel">Fonctionnels</mat-chip-option>
                <mat-chip-option value="En maintenance">En maintenance</mat-chip-option>
                <mat-chip-option value="À remplacer">À remplacer</mat-chip-option>
              </mat-chip-listbox>
            </div>

            <div class="filter-section">
              <h3>Catégorie</h3>
              <mat-form-field appearance="outline">
                <mat-label>Catégories</mat-label>
                <mat-select [formControl]="categoriesControl" multiple>
                  <mat-option value="Véhicules">Véhicules</mat-option>
                  <mat-option value="Matériel">Matériel</mat-option>
                  <mat-option value="Bâtiments">Bâtiments</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="filter-section">
              <h3>Site</h3>
              <mat-form-field appearance="outline">
                <mat-label>Sites</mat-label>
                <mat-select [formControl]="sitesControl" multiple>
                  <mat-option value="Centre Technique Municipal">Centre Technique Municipal</mat-option>
                  <mat-option value="Parc Municipal">Parc Municipal</mat-option>
                  <mat-option value="Mairie">Mairie</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="filter-section">
              <h3>Période de maintenance</h3>
              <div class="date-range">
                <mat-form-field appearance="outline">
                  <mat-label>Date début</mat-label>
                  <input matInput [matDatepicker]="startPicker" 
                         [formControl]="startDateControl">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Date fin</mat-label>
                  <input matInput [matDatepicker]="endPicker" 
                         [formControl]="endDateControl">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                </mat-form-field>
              </div>
            </div>

            <div class="filter-actions">
              <button mat-button color="primary" (click)="resetFilters()">
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .filters-container {
      background: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }

    .search-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .search-field {
      flex: 1;
    }

    .view-toggle {
      margin-left: auto;
      margin-bottom: 20px;
    }

    .advanced-filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      padding: 16px 0;
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-section h3 {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .date-range {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .filter-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class EquipmentFiltersComponent {
  @Output() onFiltersChange = new EventEmitter<EquipmentFilters>();
  @Output() onViewChange = new EventEmitter<'grid' | 'list'>();

  searchControl = new FormControl('');
  statusesControl = new FormControl<string[]>([]);
  categoriesControl = new FormControl<string[]>([]);
  sitesControl = new FormControl<string[]>([]);
  startDateControl = new FormControl<Date | null>(null);
  endDateControl = new FormControl<Date | null>(null);

  constructor() {
    // Écouter les changements de tous les contrôles
    this.searchControl.valueChanges.subscribe(() => this.emitFilters());
    this.statusesControl.valueChanges.subscribe(() => this.emitFilters());
    this.categoriesControl.valueChanges.subscribe(() => this.emitFilters());
    this.sitesControl.valueChanges.subscribe(() => this.emitFilters());
    this.startDateControl.valueChanges.subscribe(() => this.emitFilters());
    this.endDateControl.valueChanges.subscribe(() => this.emitFilters());
  }

  private emitFilters() {
    const filters: EquipmentFilters = {
      search: this.searchControl.value || '',
      statuses: this.statusesControl.value || [],
      categories: this.categoriesControl.value || [],
      sites: this.sitesControl.value || [],
      maintenanceDateRange: {
        start: this.startDateControl.value,
        end: this.endDateControl.value
      }
    };
    this.onFiltersChange.emit(filters);
  }

  resetFilters() {
    this.searchControl.reset('');
    this.statusesControl.reset([]);
    this.categoriesControl.reset([]);
    this.sitesControl.reset([]);
    this.startDateControl.reset(null);
    this.endDateControl.reset(null);
  }
}
