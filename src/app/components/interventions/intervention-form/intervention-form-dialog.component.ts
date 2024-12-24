import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Intervention } from '../../../models/intervention.model';
import { InterventionFormComponent } from './intervention-form.component';

@Component({
  selector: 'app-intervention-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, InterventionFormComponent],
  template: `
    <h2 mat-dialog-title>{{data.intervention ? 'Modifier' : 'Créer'}} une intervention</h2>
    <mat-dialog-content>
      <app-intervention-form
        [intervention]="data.intervention"
        (onSave)="onSave($event)"
        (onCancel)="onCancel()">
      </app-intervention-form>
    </mat-dialog-content>
  `
})
export class InterventionFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InterventionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { intervention: Intervention | null }
  ) {}

  onSave(intervention: Partial<Intervention>) {
    this.dialogRef.close(intervention);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
