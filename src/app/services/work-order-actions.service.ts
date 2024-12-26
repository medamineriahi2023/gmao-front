import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { WorkOrder } from '../models/work-order.model';
import { WorkOrderService } from './work-order.service';
import { ConfirmDialogComponent } from '../components/shared/confirm-dialog/confirm-dialog.component';
import { WorkOrderCompletionDialogComponent } from '../components/work-orders/work-order-completion/work-order-completion-dialog.component';
import { AuthService } from './auth.service';
import { PurchaseRequest, PurchaseRequestStatus } from '../models/purchase-request.model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderActionsService {
  constructor(
    private workOrderService: WorkOrderService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  cancelWorkOrder(workOrder: WorkOrder): Observable<WorkOrder> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Annuler le bon de travail',
        message: 'Êtes-vous sûr de vouloir annuler ce bon de travail ?',
        confirmText: 'Annuler le bon',
        cancelText: 'Retour'
      }
    });

    return dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result) {
          const updatedWorkOrder = {
            ...workOrder,
            status: 'cancelled' as const
          };
          return this.workOrderService.updateWorkOrder(updatedWorkOrder).pipe(
            tap(() => {
              this.snackBar.open('Bon de travail annulé avec succès', 'Fermer', {
                duration: 3000
              });
            })
          );
        }
        return new Observable<never>();
      })
    );
  }

  planWorkOrder(workOrder: WorkOrder, tasks: any[]): Observable<WorkOrder> {
    // Dans un environnement réel, cela serait un appel API
    return of({ ...workOrder, tasks }).pipe(
      delay(500), // Simule un délai réseau
      tap(updatedWorkOrder => {
        this.workOrderService.updateWorkOrder(updatedWorkOrder);
      })
    );
  }

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

  completeTask(workOrder: WorkOrder, taskId: number): Observable<WorkOrder> {
    const updatedWorkOrder = { ...workOrder };
    const taskIndex = updatedWorkOrder.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      updatedWorkOrder.tasks = [...updatedWorkOrder.tasks];
      updatedWorkOrder.tasks[taskIndex] = {
        ...updatedWorkOrder.tasks[taskIndex],
        status: 'completed',
        actualDuration: updatedWorkOrder.tasks[taskIndex].estimatedDuration
      };

      // Vérifier si toutes les tâches sont terminées
      const allTasksCompleted = updatedWorkOrder.tasks.every(task => task.status === 'completed');
      
      if (allTasksCompleted) {
        // Ouvrir le dialogue de complétion pour les commentaires
        return this.openCompletionDialog(updatedWorkOrder);
      }
    }

    // Si toutes les tâches ne sont pas terminées, retourner simplement le bon de travail mis à jour
    return of(updatedWorkOrder).pipe(
      delay(500),
      tap(updatedWO => {
        this.workOrderService.updateWorkOrder(updatedWO);
      })
    );
  }

  private openCompletionDialog(workOrder: WorkOrder): Observable<WorkOrder> {
    const dialogRef = this.dialog.open(WorkOrderCompletionDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { workOrder }
    });

    return dialogRef.afterClosed().pipe(
      switchMap(completionData => {
        if (!completionData) {
          // Si l'utilisateur annule, on ne marque pas le bon de travail comme terminé
          return of(workOrder);
        }

        const updatedWorkOrder = {
          ...workOrder,
          status: 'completed' as const,
          actualEndDate: new Date(),
          comments: [
            ...workOrder.comments,
            {
              id: Date.now(),
              author: this.authService.getCurrentUser()?.firstName + ' ' + this.authService.getCurrentUser()?.lastName || 'Technicien',
              content: this.formatCompletionComment(completionData),
              createdAt: new Date()
            }
          ]
        };

        return of(updatedWorkOrder).pipe(
          delay(500),
          tap(updatedWO => {
            this.workOrderService.updateWorkOrder(updatedWO);
          })
        );
      })
    );
  }

  private formatCompletionComment(completionData: any): string {
    const sections = [
      '**Résumé des travaux effectués**',
      completionData.description || 'Aucune description fournie',
      '',
      '**Solution appliquée**',
      completionData.solution || 'Aucune solution spécifiée',
      '',
      '**Commentaires additionnels**',
      completionData.additionalComments || 'Aucun commentaire additionnel'
    ];

    return sections.join('\n');
  }

  completeWorkOrder(workOrder: WorkOrder): Observable<WorkOrder> {
    const dialogRef = this.dialog.open(WorkOrderCompletionDialogComponent, {
      width: '600px',
      data: { workOrder }
    });

    return dialogRef.afterClosed().pipe(
      switchMap(completionData => {
        if (completionData) {
          const currentUser = this.authService.getCurrentUser();
          const updatedWorkOrder = {
            ...workOrder,
            status: 'completed' as const,
            actualEndDate: new Date(),
            tasks: workOrder.tasks.map(task => {
              const completedTask = completionData.completedTasks.find((ct: { id: number; description: string; notes?: string }) => ct.id === task.id);
              if (completedTask) {
                return {
                  ...task,
                  status: 'completed' as const,
                  technicianNotes: completedTask.notes
                };
              }
              return task;
            }),
            comments: [
              ...workOrder.comments,
              {
                id: workOrder.comments.length + 1,
                author: currentUser?.firstName + ' ' + currentUser?.lastName || 'Unknown',
                content: `**Rapport d'intervention**\n\n` +
                        `**Description de la panne :**\n${completionData.issueDescription}\n\n` +
                        `**Solution appliquée :**\n${completionData.solutionDescription}\n\n` +
                        `**Tâches effectuées :**\n${completionData.completedTasks
                          .map((ct: any) => `- ${ct.description}${ct.notes ? `\n  Notes: ${ct.notes}` : ''}`)
                          .join('\n')}\n\n` +
                        (completionData.additionalComments ? 
                          `**Commentaires additionnels :**\n${completionData.additionalComments}` : ''),
                createdAt: new Date()
              }
            ]
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

  addPurchaseRequest(workOrder: WorkOrder, request: Partial<PurchaseRequest>): Observable<WorkOrder> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to create a purchase request');
    }

    const now = new Date();
    const newRequest: PurchaseRequest = {
      id: Math.floor(Math.random() * 1000),
      workOrderId: workOrder.id,
      item: request.item || '',
      quantity: request.quantity || 0,
      description: request.description || '',
      requestedBy: `${currentUser.firstName} ${currentUser.lastName}`,
      status: 'pending',
      estimatedCost: request.estimatedCost,
      supplier: request.supplier,
      createdAt: now,
      updatedAt: now
    };

    if (!workOrder.purchaseRequests) {
      workOrder.purchaseRequests = [];
    }
    workOrder.purchaseRequests.push(newRequest);

    return of(workOrder).pipe(delay(500));
  }

  updatePurchaseRequestStatus(workOrder: WorkOrder, request: PurchaseRequest, newStatus: PurchaseRequestStatus): Observable<WorkOrder> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to update purchase request status');
    }

    const now = new Date();
    const userName = `${currentUser.firstName} ${currentUser.lastName}`;

    const updatedRequest: PurchaseRequest = {
      ...request,
      status: newStatus,
      updatedAt: now
    };

    switch (newStatus) {
      case 'approved':
        updatedRequest.approvedBy = userName;
        updatedRequest.approvedAt = now;
        break;
      case 'ordered':
        updatedRequest.orderedBy = userName;
        updatedRequest.orderedAt = now;
        break;
      case 'received':
        updatedRequest.receivedBy = userName;
        updatedRequest.receivedAt = now;
        break;
      case 'rejected':
        updatedRequest.rejectedBy = userName;
        updatedRequest.rejectedAt = now;
        break;
    }

    const updatedWorkOrder = { ...workOrder };
    const requestIndex = updatedWorkOrder.purchaseRequests?.findIndex(pr => pr.id === request.id) ?? -1;
    
    if (requestIndex !== -1 && updatedWorkOrder.purchaseRequests) {
      updatedWorkOrder.purchaseRequests[requestIndex] = updatedRequest;
    }

    return of(updatedWorkOrder).pipe(delay(500));
  }
}
