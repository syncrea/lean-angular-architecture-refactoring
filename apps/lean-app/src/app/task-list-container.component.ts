import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TaskListComponent } from './task-list.component';
import { Store } from '@ngrx/store';
import { TitleUpdateService } from './title-update-service.service';
import { selectAllTasks } from './state/task.selectors';
import { Task, TaskPriority } from './task.model';
import { addTask, completeTask, deleteTask } from './state/task.actions';

@Component({
  selector: 'app-task-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent],
  template: `
    <app-task-list
      [messages]="messages()"
      [tasks]="tasks()"
      (addTask)="addTask($event.title, $event.priority)"
      (completeTask)="completeTask($event.task)"
      (deleteAllTasks)="deleteAllTasks()"
    ></app-task-list>
  `,
})
export class TaskListContainerComponent {
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

  completeTask(task: Task) {
    this.#store.dispatch(completeTask({ taskId: task.id, completed: !task.completed }));
    this.#titleUpdateService.updateTitle();
  }
}
