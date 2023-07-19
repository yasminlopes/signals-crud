import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserService } from './features/users/services/user.service';
import { TaskService } from './features/tasks/services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styles: [
    `
      span {
        cursor: pointer;
      }
      mat-toolbar {
        justify-content: space-between;
      }
    `,
  ],
  providers: [UserService, TaskService],
})
export class AppComponent {
  public taskService = inject(TaskService);

  constructor() {
    effect(() => {
      localStorage.setItem(
        'TASKS',
        JSON.stringify(this.taskService.userTasks())
      );
    });
  }
}