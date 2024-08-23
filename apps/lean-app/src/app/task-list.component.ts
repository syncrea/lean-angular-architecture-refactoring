import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllTasks } from './state/task.selectors';
import { addTask, deleteTask } from './state/task.actions';
import { TaskComponent } from './task.component';
import { TaskPriority } from './task.model';
import { TitleUpdateService } from './title-update-service.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskComponent],
  template: `
    <div>
      <h1>Task List</h1>
      <div>
        <button (click)="deleteAllTasks()">Delete all Tasks</button>
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
      <button (click)="addTask(taskTitle.value, $any(taskPriority.value))">
        Add Task
      </button>
      @if (importantTasks().length > 0) {
        <h2>Important Tasks</h2>
        @for ( task of importantTasks(); track task.id) {
          <app-task [task]="task"></app-task>
        }
      }
      <h2>All Tasks</h2>
      @for ( task of tasks(); track task.id) {
        <app-task [task]="task"></app-task>
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
  #store = inject(Store);
  #titleUpdateService = inject(TitleUpdateService);

  messages = signal<string[]>([]);
  tasks = this.#store.selectSignal(selectAllTasks);
  importantTasks = computed(() => this.#getImportantTasks());

  addTask(title: string, priority: TaskPriority) {
    this.#store.dispatch(addTask({ title, priority }));
    this.#titleUpdateService.updateTitle();
  }

  #getImportantTasks() {
    const now = new Date();
    return this.tasks().filter(
      (task) =>
        !task.completed &&
        (task.priority === 'high' || (task.dueDate && task.dueDate < now))
    );
  }

  deleteAllTasks() {
    const now = new Date();
    for (const task of this.tasks()) {
      if (!task.completed && task.priority === 'high') {
        this.messages.update((messages) => [...messages, `Cannot delete uncompleted high prio task "${task.title}".`]);
        continue;
      }

      if (!task.completed && task.dueDate && task.dueDate < now) {
        this.messages.update((messages) => [...messages, `Cannot delete overdue task "${task.title}".`]);
        continue;
      }

      this.#store.dispatch(deleteTask({ taskId: task.id }));
    }

    if (this.tasks().length === 0) {
      this.messages.set(['All tasks deleted.']);
    }
    this.#titleUpdateService.updateTitle();
  }
}
