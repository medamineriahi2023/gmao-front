import { Injectable } from '@angular/core';
    import { Observable, of, BehaviorSubject } from 'rxjs';
    import { Budget } from '../models/budget.model';

    @Injectable({
      providedIn: 'root'
    })
    export class BudgetService {
      private budgets: Budget[] = [
        {
          id: 1,
          year: new Date().getFullYear() - 1,
          globalBudget: 150000,
          maintenanceBudget: 50000,
          subcontractingBudget: 30000,
          fixedBudget: 70000
        },
        {
          id: 2,
          year: new Date().getFullYear(),
          globalBudget: 200000,
          maintenanceBudget: 60000,
          subcontractingBudget: 40000,
          fixedBudget: 100000
        }
      ];
      private budgetsSubject = new BehaviorSubject<Budget[]>(this.budgets);

      getBudgets(): Observable<Budget[]> {
        return this.budgetsSubject.asObservable();
      }

      addBudget(budget: Budget): Observable<Budget> {
        const newBudget: Budget = {
          id: Math.max(0, ...this.budgets.map(b => b.id)) + 1,
          year: budget.year,
          globalBudget: budget.globalBudget,
          maintenanceBudget: budget.maintenanceBudget,
          subcontractingBudget: budget.subcontractingBudget,
          fixedBudget: budget.fixedBudget
        };
        this.budgets.push(newBudget);
        this.budgetsSubject.next(this.budgets);
        return of(newBudget);
      }
    }
