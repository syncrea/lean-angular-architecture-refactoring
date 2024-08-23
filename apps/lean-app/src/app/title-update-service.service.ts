import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllTasks } from './state/task.selectors';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TitleUpdateService {
  #store = inject(Store);
  #document = inject(DOCUMENT);
  #tasks = this.#store.selectSignal(selectAllTasks);

  constructor() {
    this.updateTitle();
  }

  updateTitle() {
    const stats = this.#tasks().reduce(
      (acc, task) => {
        return {
          completed: acc.completed + (task.completed ? 1 : 0),
          pending: acc.pending + (task.completed ? 0 : 1)
        };
      },
      { completed: 0, pending: 0 }
    );
    this.#document.title = `Lean App - ${stats.completed} completed, ${stats.pending} pending`;
  }
}
