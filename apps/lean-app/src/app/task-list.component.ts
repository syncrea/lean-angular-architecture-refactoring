import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { TaskComponent } from './task.component';
import { Task, TaskPriority } from './task.model';

@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskComponent],
  template: `
    <div>
      <h1>Task List</h1>
      <div>
        <button (click)="deleteAllTasks.emit()">Delete all Tasks</button>
      </div>
      @for (message of messages(); track $index) {
        <div>{{ message }}</div>
      }

      <input #taskTitle placeholder="New task" />
      <select #taskPriority>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button (click)="addTask.emit({title: taskTitle.value, priority: $any(taskPriority.value)})">
        Add Task
      </button>
      @if (importantTasks().length > 0) {
        <h2>Important Tasks</h2>
        @for ( task of importantTasks(); track task.id) {
          <app-task [task]="task" (completeTask)="completeTask.emit($event)"></app-task>
        }
      }
      <h2>All Tasks</h2>
      @for ( task of tasks(); track task.id) {
        <app-task [task]="task" (completeTask)="completeTask.emit($event)"></app-task>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TaskListComponent {
  messages = input<string[]>([]);
  tasks = input<Task[]>([]);
  importantTasks = computed(() => this.#getImportantTasks());

  addTask = output<{ title: string; priority: TaskPriority }>();
  completeTask = output<{ task: Task }>();
  deleteAllTasks = output<void>();

  #getImportantTasks() {
    const now = new Date();
    return this.tasks().filter(
      (task) =>
        !task.completed &&
        (task.priority === 'high' || (task.dueDate && task.dueDate < now))
    );
  }
}
