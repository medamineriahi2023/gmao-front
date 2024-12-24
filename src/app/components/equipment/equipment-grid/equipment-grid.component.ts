import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipment } from '../../../models/equipment.model';
import { EquipmentCardComponent } from '../equipment-card/equipment-card.component';

@Component({
  selector: 'app-equipment-grid',
  standalone: true,
  imports: [CommonModule, EquipmentCardComponent],
  template: `
    <div class="equipment-grid">
      <app-equipment-card
        *ngFor="let equipment of equipments"
        [equipment]="equipment"
        (onView)="onView.emit($event)"
        (onEdit)="onEdit.emit($event)"
        (onDelete)="onDelete.emit($event)"
        (onMaintenance)="onMaintenance.emit($event)">
      </app-equipment-card>
    </div>
  `,
  styles: [`
    .equipment-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      padding: 50px;
    }

    @media (max-width: 600px) {
      .equipment-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EquipmentGridComponent {
  @Input() equipments: Equipment[] = [];
  @Output() onView = new EventEmitter<Equipment>();
  @Output() onEdit = new EventEmitter<Equipment>();
  @Output() onDelete = new EventEmitter<Equipment>();
  @Output() onMaintenance = new EventEmitter<Equipment>();
}
