import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Intervention } from '../../../models/intervention.model';
import { InterventionFormComponent } from './intervention-form.component';

@Component({
  selector: 'app-intervention-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    InterventionFormComponent
  ],
  template: `
    <h2 mat-dialog-title>{{data.intervention ? 'Modifier' : 'Créer'}} une intervention</h2>
    <mat-dialog-content>
      <div class="dialog-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput [(ngModel)]="title" required>
        </mat-form-field>
        <app-intervention-form
          [intervention]="data.intervention"
          (onSave)="onSave($event)"
          (onCancel)="onCancel()">
        </app-intervention-form>
      </div>
    </mat-dialog-content>
  `,
  styles: [`
    .dialog-content {
      padding: 20px;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class InterventionFormDialogComponent {
  title = '';

  constructor(
    public dialogRef: MatDialogRef<InterventionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { intervention: Intervention | null }
  ) {}

  onSave(intervention: Partial<Intervention>) {
    const newIntervention = {
      ...intervention,
      title: this.title,
      status: intervention.status || 'planned'
    };
    this.dialogRef.close(newIntervention);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
