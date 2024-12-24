import { Routes } from '@angular/router';
    import { EquipmentListComponent } from './components/equipment-list/equipment-list.component';
    import { WorkOrderListComponent } from './components/work-orders/work-order-list/work-order-list.component';
    import { ContractListComponent } from './components/contracts/contract-list/contract-list.component';
    import { BudgetComponent } from './components/budget/budget.component';
    import { PurchaseRequestListComponent } from './components/purchase-requests/purchase-request-list/purchase-request-list.component';
    import { LoginComponent } from './components/auth/login/login.component';
    import { AuthGuard } from './services/auth.guard';

    export const routes: Routes = [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'equipments', pathMatch: 'full' },
      { path: 'equipments', component: EquipmentListComponent, canActivate: [AuthGuard] },
      { path: 'work-orders', component: WorkOrderListComponent, canActivate: [AuthGuard] },
      { path: 'contracts', component: ContractListComponent, canActivate: [AuthGuard] },
      { path: 'budget', component: BudgetComponent, canActivate: [AuthGuard] },
      { path: 'purchase-requests', component: PurchaseRequestListComponent, canActivate: [AuthGuard] }
    ];
