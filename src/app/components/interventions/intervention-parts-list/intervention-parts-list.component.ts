import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { InterventionPart } from '../../../models/intervention.model';

@Component({
  selector: 'app-intervention-parts-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="parts-list-container">
      <div class="header-actions">
        <button mat-raised-button color="primary" (click)="addPart()">
          <mat-icon>add</mat-icon>
          Ajouter une pièce
        </button>
      </div>

      <table mat-table [dataSource]="parts" class="parts-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nom</th>
          <td mat-cell *matCellDef="let part">{{part.name}}</td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef>Quantité</th>
          <td mat-cell *matCellDef="let part">
            {{part.quantity}}
            <mat-chip [color]="getStockStatusColor(part)" selected>
              Stock: {{part.stockAvailable}}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="cost">
          <th mat-header-cell *matHeaderCellDef>Coût</th>
          <td mat-cell *matCellDef="let part">
            <div class="cost-info">
              <span>{{part.unitCost | currency:'EUR'}}</span>
              <span class="total-cost">
                Total: {{part.quantity * part.unitCost | currency:'EUR'}}
              </span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let part">
            <button mat-icon-button color="primary" (click)="editPart(part)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deletePart(part)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

        <tr mat-footer-row *matFooterRowDef="['name', 'quantity', 'cost', 'actions']">
          <td mat-footer-cell colspan="2">Total</td>
          <td mat-footer-cell>
            {{getTotalCost() | currency:'EUR'}}
          </td>
          <td mat-footer-cell></td>
        </tr>
      </table>
    </div>
  `,
  styles: [`
    .parts-list-container {
      padding: 16px;
    }

    .header-actions {
      margin-bottom: 16px;
    }

    .parts-table {
      width: 100%;
    }

    .cost-info {
      display: flex;
      flex-direction: column;
    }

    .total-cost {
      font-size: 12px;
      color: #666;
    }

    mat-chip {
      font-size: 12px;
      margin-left: 8px;
    }

    .mat-footer-row {
      font-weight: bold;
    }
  `]
})
export class InterventionPartsListComponent {
  @Input() parts: InterventionPart[] = [];
  @Output() partUpdated = new EventEmitter<InterventionPart>();

  displayedColumns = ['name', 'quantity', 'cost', 'actions'];

  getStockStatusColor(part: InterventionPart): string {
    if (part.stockAvailable >= part.quantity) return 'primary';
    if (part.stockAvailable > 0) return 'accent';
    return 'warn';
  }

  getTotalCost(): number {
    return this.parts.reduce((total, part) => total + (part.quantity * part.unitCost), 0);
  }

  addPart() {
    // TODO: Implement part addition dialog
  }

  editPart(part: InterventionPart) {
    // TODO: Implement part edit dialog
  }

  deletePart(part: InterventionPart) {
    // TODO: Implement part deletion with confirmation
  }
}
