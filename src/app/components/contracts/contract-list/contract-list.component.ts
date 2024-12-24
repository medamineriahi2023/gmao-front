import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contract } from '../../../models/contract.model';
import { ContractService } from '../../../services/contract.service';
import { ContractFormDialogComponent } from '../contract-form/contract-form-dialog.component';
import { ContractDetailsDialogComponent } from '../contract-details/contract-details-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-contract-list',
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
          <h1>Contrats</h1>
          <p class="subtitle">Gestion des contrats fournisseurs et sous-traitants</p>
        </div>
        <button mat-raised-button color="primary" (click)="createContract()">
          <mat-icon>add</mat-icon>
          Nouveau contrat
        </button>
      </div>

      <table mat-table [dataSource]="contracts" class="mat-elevation-z2">
        <ng-container matColumnDef="reference">
          <th mat-header-cell *matHeaderCellDef>Référence</th>
          <td mat-cell *matCellDef="let contract">{{contract.reference}}</td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Titre</th>
          <td mat-cell *matCellDef="let contract">{{contract.title}}</td>
        </ng-container>

        <ng-container matColumnDef="provider">
          <th mat-header-cell *matHeaderCellDef>Fournisseur</th>
          <td mat-cell *matCellDef="let contract">{{contract.provider.name}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let contract">
            <span class="status-chip" [ngClass]="'status-' + contract.status">
              {{getStatusLabel(contract.status)}}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef>Validité</th>
          <td mat-cell *matCellDef="let contract">
            {{contract.startDate | date:'dd/MM/yyyy'}} - {{contract.endDate | date:'dd/MM/yyyy'}}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let contract">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="viewDetails(contract)">
                <mat-icon>visibility</mat-icon>
                <span>Voir détails</span>
              </button>
              <button mat-menu-item (click)="editContract(contract)">
                <mat-icon>edit</mat-icon>
                <span>Modifier</span>
              </button>
              <button mat-menu-item (click)="renewContract(contract)">
                <mat-icon>autorenew</mat-icon>
                <span>Renouveler</span>
              </button>
              <button mat-menu-item class="delete-action" (click)="deleteContract(contract)">
                <mat-icon>delete</mat-icon>
                <span>Supprimer</span>
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

    .status-chip {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-active { background: #e8f5e9; color: #2e7d32; }
    .status-expired { background: #ffebee; color: #c62828; }
    .status-pending { background: #e3f2fd; color: #1565c0; }
    .status-terminated { background: #fafafa; color: #616161; }

    .delete-action {
      color: #f44336;
    }
  `]
})
export class ContractListComponent implements OnInit {
  contracts: Contract[] = [];
  displayedColumns = ['reference', 'title', 'provider', 'status', 'dates', 'actions'];

  constructor(
    private dialog: MatDialog,
    private contractService: ContractService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    this.contractService.getContracts().subscribe(
      contracts => this.contracts = contracts
    );
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'active': 'Actif',
      'expired': 'Expiré',
      'pending': 'En attente',
      'terminated': 'Résilié'
    };
    return labels[status] || status;
  }

  createContract() {
    const dialogRef = this.dialog.open(ContractFormDialogComponent, {
      width: '800px',
      data: { contract: null }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.contractService.createContract(result).subscribe(() => {
          this.loadContracts();
          this.snackBar.open('Contrat créé avec succès', 'Fermer', {
            duration: 3000
          });
        });
      }
    });
  }

  editContract(contract: Contract) {
    const dialogRef = this.dialog.open(ContractFormDialogComponent, {
      width: '800px',
      data: { contract }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.contractService.updateContract({ ...contract, ...result }).subscribe(() => {
          this.loadContracts();
          this.snackBar.open('Contrat modifié avec succès', 'Fermer', {
            duration: 3000
          });
        });
      }
    });
  }

  viewDetails(contract: Contract) {
    this.dialog.open(ContractDetailsDialogComponent, {
      width: '800px',
      data: { contract }
    });
  }

  deleteContract(contract: Contract) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer le contrat',
        message: 'Êtes-vous sûr de vouloir supprimer ce contrat ?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.contractService.deleteContract(contract.id).subscribe(() => {
          this.loadContracts();
          this.snackBar.open('Contrat supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        });
      }
    });
  }

  renewContract(contract: Contract) {
    // TODO: Implement contract renewal
    console.log('Renouvellement du contrat:', contract);
  }
}
