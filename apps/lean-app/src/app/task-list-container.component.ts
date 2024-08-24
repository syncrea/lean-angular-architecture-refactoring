import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TaskListComponent } from './task-list.component';
import { Store } from '@ngrx/store';
import { TitleUpdateService } from './title-update-service.service';
import { selectAllTasks, selectMessages } from './state/task.selectors';
import { Task, TaskPriority } from './task.model';
import { addTask, completeTask, purgeTasks } from './state/task.actions';
import { getImportantTasks } from './task.helpers';

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

  messages = this.#store.selectSignal(selectMessages);
  tasks = this.#store.selectSignal(selectAllTasks);
  importantTasks = computed(() => getImportantTasks(this.tasks(), new Date()));

  addTask(title: string, priority: TaskPriority) {
    this.#store.dispatch(addTask({ title, priority }));
    this.#titleUpdateService.updateTitle();
  }

  deleteAllTasks() {
    this.#store.dispatch(purgeTasks({ tasks: this.tasks() }));
  }

  completeTask(task: Task) {
    this.#store.dispatch(completeTask({ taskId: task.id, completed: !task.completed }));
    this.#titleUpdateService.updateTitle();
  }
}
