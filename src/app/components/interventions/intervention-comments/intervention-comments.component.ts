import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InterventionComment } from '../../../models/intervention.model';

@Component({
  selector: 'app-intervention-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="comments-container">
      <div class="comment-form">
        <mat-form-field appearance="outline" class="comment-input">
          <mat-label>Ajouter un commentaire</mat-label>
          <textarea matInput
                    [(ngModel)]="newComment"
                    placeholder="Votre commentaire..."
                    rows="3">
          </textarea>
        </mat-form-field>
        <button mat-raised-button
                color="primary"
                [disabled]="!newComment.trim()"
                (click)="addComment()">
          Ajouter
        </button>
      </div>

      <div class="comments-list">
        <mat-card *ngFor="let comment of sortedComments" class="comment-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>account_circle</mat-icon>
            <mat-card-title>{{comment.author}}</mat-card-title>
            <mat-card-subtitle>
              {{comment.createdAt | date:'dd/MM/yyyy HH:mm'}}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{comment.content}}</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .comments-container {
      padding: 16px;
    }

    .comment-form {
      margin-bottom: 24px;
    }

    .comment-input {
      width: 100%;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comment-card {
      background: #f8f9fa;
    }

    .comment-card:hover {
      background: #f1f3f4;
    }
  `]
})
export class InterventionCommentsComponent {
  @Input() comments: InterventionComment[] = [];
  @Output() commentAdded = new EventEmitter<Partial<InterventionComment>>();

  newComment = '';

  get sortedComments(): InterventionComment[] {
    return [...this.comments].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  addComment() {
    if (this.newComment.trim()) {
      const comment: Partial<InterventionComment> = {
        content: this.newComment.trim(),
        createdAt: new Date()
      };
      this.commentAdded.emit(comment);
      this.newComment = '';
    }
  }
}
