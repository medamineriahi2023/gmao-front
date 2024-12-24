import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { WorkOrder } from '../models/work-order.model';
import { WorkOrderService } from './work-order.service';
import { ConfirmDialogComponent } from '../components/shared/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderActionsService {
  constructor(
    private workOrderService: WorkOrderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  startWorkOrder(workOrder: WorkOrder): Observable<WorkOrder> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Démarrer le bon de travail',
        message: 'Voulez-vous démarrer ce bon de travail maintenant ?',
        confirmText: 'Démarrer',
        cancelText: 'Annuler'
      }
    });

    return dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result) {
          const updatedWorkOrder = {
            ...workOrder,
            status: 'in_progress' as const,
            actualStartDate: new Date()
          };
          return this.workOrderService.updateWorkOrder(updatedWorkOrder).pipe(
            tap(() => {
              this.snackBar.open('Bon de travail démarré avec succès', 'Fermer', {
                duration: 3000
              });
            })
          );
        }
        return new Observable<never>();
      })
    );
  }

  completeWorkOrder(workOrder: WorkOrder): Observable<WorkOrder> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Terminer le bon de travail',
        message: 'Voulez-vous marquer ce bon de travail comme terminé ?',
        confirmText: 'Terminer',
        cancelText: 'Annuler'
      }
    });

    return dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result) {
          const updatedWorkOrder = {
            ...workOrder,
            status: 'completed' as const,
            actualEndDate: new Date()
          };
          return this.workOrderService.updateWorkOrder(updatedWorkOrder).pipe(
            tap(() => {
              this.snackBar.open('Bon de travail terminé avec succès', 'Fermer', {
                duration: 3000
              });
            })
          );
        }
        return new Observable<never>();
      })
    );
  }
}
