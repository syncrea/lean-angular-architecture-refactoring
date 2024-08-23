import { Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { completeTask } from './state/task.actions';
import { Task } from './task.model';
import { TitleUpdateService } from './title-update-service.service';

@Component({
  selector: 'app-task',
  standalone: true,
  template: `
    @let t = task();
    <div>
      <span>[{{ t.priority }}] </span>
      <span [class.completed]="t.completed">{{ t.title }} </span>
      <button (click)="onTaskComplete()">{{t.completed ? 'Undone' : 'Done'}} </button>
      @if (overdue()) {
      <span>Overdue!</span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .completed {
        text-decoration: line-through;
      }
    `,
  ],
})
export class TaskComponent {
  #store = inject(Store);
  #titleUpdateService = inject(TitleUpdateService);

  task = input.required<Task>();
  overdue = computed(() => this.#isOverdue());

  onTaskComplete() {
    this.#store.dispatch(completeTask({ taskId: this.task().id, completed: !this.task().completed }));
    this.#titleUpdateService.updateTitle();
  }

  #isOverdue() {
    const task = this.task();
    return task.dueDate && task.dueDate < new Date();
  }
}
