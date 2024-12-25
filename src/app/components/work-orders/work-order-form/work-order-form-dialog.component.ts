import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { WorkOrderFormComponent } from './work-order-form.component';

@Component({
  selector: 'app-work-order-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatNativeDateModule,
    WorkOrderFormComponent
  ],
  template: `
    <app-work-order-form></app-work-order-form>
  `
})
export class WorkOrderFormDialogComponent {}
