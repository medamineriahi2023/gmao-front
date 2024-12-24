import { Component, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { MatTableModule } from '@angular/material/table';
    import { MatButtonModule } from '@angular/material/button';
    import { MatIconModule } from '@angular/material/icon';
    import { MatMenuModule } from '@angular/material/menu';
    import { MatDialog } from '@angular/material/dialog';
    import { MatSnackBar } from '@angular/material/snack-bar';
    import { PurchaseRequest } from '../../../models/purchase-request.model';
    import { PurchaseRequestService } from '../../../services/purchase-request.service';
    import { PurchaseRequestFormComponent } from '../purchase-request-form/purchase-request-form.component';
    import { PurchaseRequestDetailsDialogComponent } from '../purchase-request-details-dialog/purchase-request-details-dialog.component';
    import { AuthService } from '../../../services/auth.service';

    @Component({
      selector: 'app-purchase-request-list',
      standalone: true,
      imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
      ],
      template: `
        <div class="page-container">
          <div class="page-header">
            <div class="header-content">
              <h1>Demandes d'Achat</h1>
              <p class="subtitle">Suivi des demandes d'achat</p>
            </div>
            <button mat-raised-button color="primary" (click)="openPurchaseRequestForm()" *ngIf="canCreateRequest()">
              <mat-icon>add</mat-icon>
              Nouvelle Demande
            </button>
          </div>

          <table mat-table [dataSource]="purchaseRequests" class="mat-elevation-z2">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let request">{{request.id}}</td>
            </ng-container>

            <ng-container matColumnDef="item">
              <th mat-header-cell *matHeaderCellDef>Article</th>
              <td mat-cell *matCellDef="let request">{{request.item}}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let request">
                <span class="status-chip" [ngClass]="'status-' + request.status">
                  {{getStatusLabel(request.status)}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="requestedBy">
              <th mat-header-cell *matHeaderCellDef>Demandeur</th>
              <td mat-cell *matCellDef="let request">{{request.requestedBy}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let request">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="viewPurchaseRequestDetails(request)">
                    <mat-icon>visibility</mat-icon>
                    <span>Voir détails</span>
                  </button>
                  <button mat-menu-item (click)="editPurchaseRequest(request)" *ngIf="canEditRequest(request)">
                    <mat-icon>edit</mat-icon>
                    <span>Modifier</span>
                  </button>
                  <button mat-menu-item (click)="approvePurchaseRequest(request)" *ngIf="canApproveRequest(request)">
                    <mat-icon>check</mat-icon>
                    <span>Approuver</span>
                  </button>
                  <button mat-menu-item (click)="rejectPurchaseRequest(request)" *ngIf="canRejectRequest(request)">
                    <mat-icon>close</mat-icon>
                    <span>Rejeter</span>
                  </button>
                  <button mat-menu-item (click)="orderPurchaseRequest(request)" *ngIf="canOrderRequest(request)">
                    <mat-icon>shopping_cart</mat-icon>
                    <span>Commander</span>
                  </button>
                  <button mat-menu-item (click)="receivePurchaseRequest(request)" *ngIf="canReceiveRequest(request)">
                    <mat-icon>done</mat-icon>
                    <span>Réceptionner</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      `,
      styles: [`
        .page-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        table {
          width: 100%;
        }

        .status-chip {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-pending {
          background-color: #e3f2fd;
          color: #1565c0;
        }

        .status-approved {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .status-rejected {
          background-color: #ffebee;
          color: #c62828;
        }

        .status-ordered {
          background-color: #fff3e0;
          color: #f57c00;
        }

        .status-received {
          background-color: #c8e6c9;
          color: #2e7d32;
        }
      `]
    })
    export class PurchaseRequestListComponent implements OnInit {
      purchaseRequests: PurchaseRequest[] = [];
      displayedColumns = ['id', 'item', 'status', 'requestedBy', 'actions'];

      constructor(
        private purchaseRequestService: PurchaseRequestService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private authService: AuthService
      ) {}

      ngOnInit() {
        this.loadPurchaseRequests();
      }

      loadPurchaseRequests() {
        this.purchaseRequestService.getPurchaseRequests().subscribe(requests => {
          this.purchaseRequests = requests;
        });
      }

      openPurchaseRequestForm() {
        this.dialog.open(PurchaseRequestFormComponent, {
          width: '600px',
          data: { request: null }
        }).afterClosed().subscribe((result: PurchaseRequest | null) => {
          if (result) {
            this.purchaseRequestService.addPurchaseRequest(result).subscribe(newRequest => {
              this.loadPurchaseRequests();
              this.snackBar.open(`Demande d'achat #${newRequest.id} ajoutée avec succès`, 'Fermer', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            });
          }
        });
      }

      viewPurchaseRequestDetails(request: PurchaseRequest) {
        this.dialog.open(PurchaseRequestDetailsDialogComponent, {
          width: '600px',
          data: { request }
        });
      }

      editPurchaseRequest(request: PurchaseRequest) {
        this.dialog.open(PurchaseRequestFormComponent, {
          width: '600px',
          data: { request }
        }).afterClosed().subscribe((result: PurchaseRequest | null)  => {
          if (result) {
            this.purchaseRequestService.updatePurchaseRequest({ ...request, ...result }).subscribe(updatedRequest => {
              this.loadPurchaseRequests();
              this.snackBar.open(`Demande d'achat #${updatedRequest.id} modifiée avec succès`, 'Fermer', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            });
          }
        });
      }

      approvePurchaseRequest(request: PurchaseRequest) {
        this.purchaseRequestService.updatePurchaseRequest({ ...request, status: 'approved' }).subscribe(updatedRequest => {
          this.loadPurchaseRequests();
          this.snackBar.open(`Demande d'achat #${updatedRequest.id} approuvée`, 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        });
      }

      rejectPurchaseRequest(request: PurchaseRequest) {
        this.purchaseRequestService.updatePurchaseRequest({ ...request, status: 'rejected' }).subscribe(updatedRequest => {
          this.loadPurchaseRequests();
          this.snackBar.open(`Demande d'achat #${updatedRequest.id} rejetée`, 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        });
      }

      orderPurchaseRequest(request: PurchaseRequest) {
        this.purchaseRequestService.updatePurchaseRequest({ ...request, status: 'ordered' }).subscribe(updatedRequest => {
          this.loadPurchaseRequests();
           this.snackBar.open(`Demande d'achat #${updatedRequest.id} commandée`, 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        });
      }

      receivePurchaseRequest(request: PurchaseRequest) {
        this.purchaseRequestService.updatePurchaseRequest({ ...request, status: 'received' }).subscribe(updatedRequest => {
          this.loadPurchaseRequests();
          this.snackBar.open(`Demande d'achat #${updatedRequest.id} réceptionnée`, 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        });
      }

      canCreateRequest(): boolean {
        return this.authService.hasRole('technician') || this.authService.hasRole('maintenance_chief');
      }

      canEditRequest(request: PurchaseRequest): boolean {
        const user = this.authService.getCurrentUser();
        return (user?.username === request.requestedBy && request.status === 'pending') || this.authService.hasRole('maintenance_chief');
      }

      canApproveRequest(request: PurchaseRequest): boolean {
        return this.authService.hasRole('maintenance_chief') && request.status === 'pending';
      }

      canRejectRequest(request: PurchaseRequest): boolean {
        return this.authService.hasRole('maintenance_chief') && request.status === 'pending';
      }

      canOrderRequest(request: PurchaseRequest): boolean {
        return this.authService.hasRole('store_manager') && request.status === 'approved';
      }

      canReceiveRequest(request: PurchaseRequest): boolean {
        return this.authService.hasRole('purchase_manager') && request.status === 'ordered';
      }

      getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
          'pending': 'En attente',
          'approved': 'Approuvée',
          'rejected': 'Rejetée',
          'ordered': 'Commandée',
          'received': 'Reçue'
        };
        return labels[status] || status;
      }
    }
