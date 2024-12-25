import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrder } from '../../../models/work-order.model';

@Component({
  selector: 'app-work-order-completion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Finalisation du bon de travail</h2>
    <div mat-dialog-content>
      <p>Toutes les tâches ont été complétées. Veuillez fournir un résumé des travaux effectués.</p>

      <mat-form-field class="full-width">
        <mat-label>Description des travaux effectués</mat-label>
        <textarea matInput [(ngModel)]="completionData.description" 
                  rows="4" required
                  placeholder="Décrivez les travaux réalisés..."></textarea>
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Solution appliquée</mat-label>
        <textarea matInput [(ngModel)]="completionData.solution" 
                  rows="4" required
                  placeholder="Décrivez la solution mise en place..."></textarea>
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Commentaires additionnels</mat-label>
        <textarea matInput [(ngModel)]="completionData.additionalComments" 
                  rows="4"
                  placeholder="Ajoutez des commentaires supplémentaires si nécessaire..."></textarea>
      </mat-form-field>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="!isValid()"
              (click)="save()">
        Terminer
      </button>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    textarea {
      resize: vertical;
    }
  `]
})
export class WorkOrderCompletionDialogComponent {
  completionData = {
    description: '',
    solution: '',
    additionalComments: ''
  };

  constructor(
    public dialogRef: MatDialogRef<WorkOrderCompletionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { workOrder: WorkOrder }
  ) {}

  isValid(): boolean {
    return this.completionData.description.trim() !== '' &&
           this.completionData.solution.trim() !== '';
  }

  save() {
    this.dialogRef.close(this.completionData);
  }
}
