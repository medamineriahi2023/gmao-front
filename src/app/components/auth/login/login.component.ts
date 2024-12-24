import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { MatCardModule } from '@angular/material/card';
    import { MatFormFieldModule } from '@angular/material/form-field';
    import { MatInputModule } from '@angular/material/input';
    import { MatButtonModule } from '@angular/material/button';
    import { Router } from '@angular/router';
    import { AuthService } from '../../../services/auth.service';

    @Component({
      selector: 'app-login',
      standalone: true,
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      template: `
        <div class="login-container">
          <mat-card class="login-card">
            <mat-card-title>Connexion</mat-card-title>
            <mat-card-content>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nom d'utilisateur</mat-label>
                  <input matInput formControlName="username" required>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Mot de passe</mat-label>
                  <input matInput type="password" formControlName="password" required>
                </mat-form-field>

                <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.valid">
                  Se connecter
                </button>
              </form>
            </mat-card-content>
          </mat-card>
        </div>
      `,
      styles: [`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .login-card {
          width: 400px;
          padding: 24px;
        }

        .full-width {
          width: 100%;
        }
      `]
    })
    export class LoginComponent {
      loginForm: FormGroup;

      constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
      ) {
        this.loginForm = this.fb.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
        });
      }

      onSubmit() {
        if (this.loginForm.valid) {
          const { username, password } = this.loginForm.value;
          this.authService.login(username, password);
          this.router.navigate(['/']);
        }
      }
    }
