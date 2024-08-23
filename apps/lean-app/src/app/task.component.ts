import { Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { completeTask } from './state/task.actions';
import { Task } from './task.model';

@Component({
  selector: 'app-task',
  standalone: true,
  template: `
    @let taskValue = task();
    <div>
      <span [class.completed]="taskValue.completed">{{ taskValue.title }}</span>
      <button (click)="onTaskComplete()">Complete</button>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .completed { text-decoration: line-through; }
  `]
})
export class TaskComponent {
  #store = inject(Store);

  task = input.required<Task>();

  onTaskComplete() {
    this.#store.dispatch(completeTask({ taskId: this.task().id }));
  }
}
