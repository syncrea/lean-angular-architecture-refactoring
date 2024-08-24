import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Task } from './task.model';

@Component({
  selector: 'app-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    @let t = task();
    <div>
      <span>[{{ t.priority }}] </span>
      <span [class.completed]="t.completed">{{ t.title }} </span>
      <button (click)="completeTask.emit({task: t})">{{t.completed ? 'Undone' : 'Done'}} </button>
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
  task = input.required<Task>();
  overdue = computed(() => this.#isOverdue());

  completeTask = output<{ task: Task }>();

  #isOverdue() {
    const task = this.task();
    return task.dueDate && task.dueDate < new Date();
  }
}
