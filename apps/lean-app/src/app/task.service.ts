import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTask, completeTask } from './state/task.actions';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private store: Store) {}

  addTask(title: string) {
    this.store.dispatch(addTask({ title }));
  }

  completeTask(taskId: number) {
    this.store.dispatch(completeTask({ taskId }));
  }
}
