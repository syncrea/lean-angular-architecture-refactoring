import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllTasks } from './state/task.selectors';
import { addTask } from './state/task.actions';
import { TaskComponent } from './task.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskComponent, AsyncPipe],
  template: `
    <div>
      <h1>Task List</h1>
      <input #taskTitle placeholder="New task" />
      <button (click)="addTask(taskTitle.value)">Add Task</button>
      <ul>
        @for ( task of tasks$ | async; track task.id) {
          <li>
            <app-task [task]="task"></app-task>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TaskListComponent {
  #store = inject(Store);
  tasks$ = this.#store.select(selectAllTasks);

  addTask(taskTitle: string) {
    if (taskTitle) {
      this.#store.dispatch(addTask({ title: taskTitle }));
    }
  }
}
