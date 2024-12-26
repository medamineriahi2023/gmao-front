import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchaseRequestService } from '../../../services/purchase-request.service';
import { PurchaseRequest, PurchaseRequestStatus } from '../../../models/purchase-request.model';
import { PurchaseRequestDialogComponent } from '../purchase-request-dialog/purchase-request-dialog.component';

@Component({
  selector: 'app-purchase-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="purchase-requests-container">
      <div class="header">
        <h2>Liste des demandes d'achat</h2>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add_shopping_cart</mat-icon>
          Nouvelle demande
        </button>
      </div>

      <table mat-table [dataSource]="purchaseRequests" class="mat-elevation-z8">
        <!-- Colonnes de la table -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let request">{{request.id}}</td>
        </ng-container>

        <ng-container matColumnDef="item">
          <th mat-header-cell *matHeaderCellDef>Article</th>
          <td mat-cell *matCellDef="let request">{{request.item}}</td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef>Quantité</th>
          <td mat-cell *matCellDef="let request">{{request.quantity}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let request">
            <span [class]="'status-badge status-' + request.status">
              {{getStatusLabel(request.status)}}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let request">
            <button mat-icon-button color="primary" 
                    (click)="openEditDialog(request)"
                    [disabled]="request.status !== 'pending'">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="accent"
                    (click)="approveRequest(request)"
                    *ngIf="request.status === 'pending'">
              <mat-icon>check</mat-icon>
            </button>
            <button mat-icon-button color="warn"
                    (click)="rejectRequest(request)"
                    *ngIf="request.status === 'pending'">
              <mat-icon>close</mat-icon>
            </button>
            <button mat-icon-button color="primary"
                    (click)="markAsOrdered(request)"
                    *ngIf="request.status === 'approved'">
              <mat-icon>shopping_cart</mat-icon>
            </button>
            <button mat-icon-button color="primary"
                    (click)="markAsReceived(request)"
                    *ngIf="request.status === 'ordered'">
              <mat-icon>inventory</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .purchase-requests-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .status-pending {
      background-color: #fff3e0;
      color: #e65100;
    }

    .status-approved {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-ordered {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-received {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .status-rejected {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class PurchaseRequestListComponent implements OnInit {
  purchaseRequests: PurchaseRequest[] = [];
  displayedColumns: string[] = ['id', 'item', 'quantity', 'status', 'actions'];

  constructor(
    private purchaseRequestService: PurchaseRequestService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPurchaseRequests();
  }

  loadPurchaseRequests() {
    this.purchaseRequestService.getPurchaseRequests().subscribe({
      next: (requests) => {
        this.purchaseRequests = requests;
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement des demandes', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(PurchaseRequestDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: Partial<PurchaseRequest>) => {
      if (result) {
        this.purchaseRequestService.addPurchaseRequest(result).subscribe({
          next: (newRequest) => {
            this.purchaseRequests.push(newRequest);
            this.snackBar.open('Demande d\'achat créée avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la création de la demande', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  openEditDialog(request: PurchaseRequest) {
    const dialogRef = this.dialog.open(PurchaseRequestDialogComponent, {
      width: '600px',
      data: request
    });

    dialogRef.afterClosed().subscribe((result: Partial<PurchaseRequest>) => {
      if (result) {
        this.purchaseRequestService.updatePurchaseRequest({ ...request, ...result }).subscribe({
          next: (updatedRequest) => {
            const index = this.purchaseRequests.findIndex(r => r.id === updatedRequest.id);
            if (index !== -1) {
              this.purchaseRequests[index] = updatedRequest;
            }
            this.snackBar.open('Demande d\'achat mise à jour avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la mise à jour de la demande', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  approveRequest(request: PurchaseRequest) {
    this.purchaseRequestService.updatePurchaseRequestStatus(request, 'approved').subscribe({
      next: (updatedRequest) => {
        const index = this.purchaseRequests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          this.purchaseRequests[index] = updatedRequest;
        }
        this.snackBar.open('Demande approuvée', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Erreur lors de l\'approbation', 'Fermer', { duration: 3000 });
      }
    });
  }

  rejectRequest(request: PurchaseRequest) {
    this.purchaseRequestService.updatePurchaseRequestStatus(request, 'rejected').subscribe({
      next: (updatedRequest) => {
        const index = this.purchaseRequests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          this.purchaseRequests[index] = updatedRequest;
        }
        this.snackBar.open('Demande rejetée', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du rejet', 'Fermer', { duration: 3000 });
      }
    });
  }

  markAsOrdered(request: PurchaseRequest) {
    this.purchaseRequestService.updatePurchaseRequestStatus(request, 'ordered').subscribe({
      next: (updatedRequest) => {
        const index = this.purchaseRequests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          this.purchaseRequests[index] = updatedRequest;
        }
        this.snackBar.open('Demande marquée comme commandée', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  markAsReceived(request: PurchaseRequest) {
    this.purchaseRequestService.updatePurchaseRequestStatus(request, 'received').subscribe({
      next: (updatedRequest) => {
        const index = this.purchaseRequests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          this.purchaseRequests[index] = updatedRequest;
        }
        this.snackBar.open('Demande marquée comme reçue', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  getStatusLabel(status: PurchaseRequestStatus): string {
    const labels: Record<PurchaseRequestStatus, string> = {
      'pending': 'En attente',
      'approved': 'Approuvé',
      'ordered': 'Commandé',
      'received': 'Reçu',
      'rejected': 'Rejeté'
    };
    return labels[status] || status;
  }
}
