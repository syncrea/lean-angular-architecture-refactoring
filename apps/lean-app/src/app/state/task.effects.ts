import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { deleteTask, purgeTasks, updateMessages } from './task.actions';
import { tap } from 'rxjs';
import { prepareTaskPurge } from '../task.helpers';
import { Store } from '@ngrx/store';

export const purgeTasksEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(purgeTasks),
      tap((action) => {
        const now = new Date();
        const result = prepareTaskPurge(action.tasks, now);

        if (result.type === 'NothingToPurge') {
          store.dispatch(updateMessages({ messages: ['Nothing to delete.'] }));
        } else if (result.type === 'PurgeAllTasks') {
          store.dispatch(updateMessages({ messages: ['Deleted all tasks.'] }));
          for (const task of result.toBeDeleted) {
            store.dispatch(deleteTask({ taskId: task.id }));
          }
        } else if (result.type === 'PartialTasksPurge') {
          const messages = [
            `Deleted ${result.toBeDeleted.length} tasks.`,
            ...result.categorizedTasks.important.map((task) => `Cannot delete important task "${task.title}".`),
            ...result.categorizedTasks.overdue.map((task) => `Cannot delete overdue task "${task.title}".`),
          ];
          store.dispatch(updateMessages({ messages }));
          for (const task of result.toBeDeleted) {
            store.dispatch(deleteTask({ taskId: task.id }));
          }
        }
      })
    );
  },
  { functional: true, dispatch: false }
);
