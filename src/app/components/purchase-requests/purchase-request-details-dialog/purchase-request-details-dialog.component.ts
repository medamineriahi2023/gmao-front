import { Component, Inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { MatButtonModule } from '@angular/material/button';
    import { PurchaseRequest } from '../../../models/purchase-request.model';

    @Component({
      selector: 'app-purchase-request-details-dialog',
      standalone: true,
      imports: [CommonModule, MatDialogModule, MatButtonModule],
      template: `
        <h2 mat-dialog-title>Détails de la Demande d'Achat #{{data.request.id}}</h2>
        <mat-dialog-content>
          <div class="details-container">
            <div class="info-section">
              <h3>Article</h3>
              <p>{{data.request.item}}</p>
            </div>

            <div class="info-section">
              <h3>Quantité</h3>
              <p>{{data.request.quantity}}</p>
            </div>

            <div class="info-section">
              <h3>Demandeur</h3>
              <p>{{data.request.requestedBy}}</p>
            </div>

            <div class="info-section">
              <h3>Description</h3>
              <p>{{data.request.description}}</p>
            </div>

            <div class="info-section">
              <h3>Statut</h3>
              <p>{{data.request.status}}</p>
            </div>
          </div>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
          <button mat-button mat-dialog-close>Fermer</button>
        </mat-dialog-actions>
      `,
      styles: [`
        .details-container {
          padding: 16px;
        }

        .info-section {
          margin-bottom: 16px;
        }

        .info-section h3 {
          margin-bottom: 8px;
          font-size: 16px;
          font-weight: 500;
        }
      `]
    })
    export class PurchaseRequestDetailsDialogComponent {
      constructor(
        public dialogRef: MatDialogRef<PurchaseRequestDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { request: PurchaseRequest }
      ) {}
    }
