import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Intervention } from '../../../models/intervention.model';
import { InterventionFormComponent } from './intervention-form.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-intervention-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, InterventionFormComponent],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }  // or your preferred locale
  ],
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
