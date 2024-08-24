import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectAllTasks } from './state/task.selectors';

export const activateTitleUpdate = () => {
  const store = inject(Store);
  const document = inject(DOCUMENT);
  const tasks = store.select(selectAllTasks);
  const destroyRef = inject(DestroyRef);

  return tasks.pipe(
    takeUntilDestroyed(destroyRef),
  ).subscribe((tasks) => {
    const stats = tasks.reduce(
      (acc, task) => {
        return {
          completed: acc.completed + (task.completed ? 1 : 0),
          pending: acc.pending + (task.completed ? 0 : 1)
        };
      },
      { completed: 0, pending: 0 }
    );
    document.title = `Lean App - ${stats.completed} completed, ${stats.pending} pending`;
  });
};
