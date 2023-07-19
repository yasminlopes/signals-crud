import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task } from '../../models/task.model';
import { UserService } from 'src/app/features/users/services/user.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})

export class TaskDetailsComponent implements OnInit {

  public displayedColumns = ['id', 'name', 'description', 'completed'];

  public fullColumns = [...this.displayedColumns, 'status', 'delete'];

  public selecterUserId!: number;

  public userService = inject(UserService);

  public taskService = inject(TaskService);

  public route = inject(ActivatedRoute);

  public router = inject(Router);

  public http = inject(HttpClient);

  public destroyRef = inject(DestroyRef);

  public userTasks = this.taskService.userTasks;

  public tasksUrl = 'http://localhost:3000/tasks';


  public ngOnInit(): void {
    this.selecterUserId = +this.route.snapshot.paramMap.get('id')!;

    if (this.selecterUserId) {
      this.userService.setSelectedUserId(this.selecterUserId);
    } else {
      this.router.navigateByUrl('/');
    }

  }

  public updteTaskStatus(task: Task, completed: boolean): void {
    this.taskService.updteTaskStatus(task, completed);
  }

  // public updteTaskStatus(task: Task): void {

  //   const completedTask = {
  //     ...task,
  //     completed: true,
  //   };

  //   this.http
  //     .put(this.tasksUrl + '/' + task.id, completedTask)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: () => {
  //         this.taskService.userTasks.mutate(() => (task.completed = true));
  //       },
  //       //! Error handling
  //     });
  // }

  public deleteTask(taskId: number): void {
    this.http
      .delete(this.tasksUrl + '/' + taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.taskService.userTasks.update((tasks) =>
            tasks.filter((task) => task.id !== taskId)
          );
        },
        //! Error handling
      });
  }

  public addNewTask(): void {
    const newTask  = {
      name: "New task",
      description: "New task description",
      completed: false
    }

    this.http
      .post(this.tasksUrl, newTask)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const responseTaks = response as Task;
          this.userTasks.update((task) => [...task, responseTaks]);
        },
        //! Error handling
      });
  }
}