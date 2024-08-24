import { Task } from './task.model';

export const getImportantTasks = (tasks: readonly Task[], now: Date) => tasks.filter(
  (task) =>
    !task.completed &&
    (task.priority === 'high' || (task.dueDate && task.dueDate < now))
);

export const isTaskOverdue = (task: Task, now: Date) => task.dueDate && task.dueDate < now;

export type PrepareTaskPurgeResultType = 'NothingToPurge' | 'PurgeAllTasks' | 'PartialTasksPurge';
export interface PrepareTaskPurgeResultBase {
  readonly type: PrepareTaskPurgeResultType;
}

export interface PrepareTaskPurgeResultNothingToPurge extends PrepareTaskPurgeResultBase {
  readonly type: 'NothingToPurge';
}

export interface PrepareTaskPurgeResultPurgeAllTasks extends PrepareTaskPurgeResultBase {
  readonly type: 'PurgeAllTasks';
  readonly toBeDeleted: readonly Task[];
}

export interface PrepareTaskPurgeResultPartialTasksPurge extends PrepareTaskPurgeResultBase {
  readonly type: 'PartialTasksPurge';
  readonly categorizedTasks: {
    readonly important: readonly Task[];
    readonly overdue: readonly Task[];
    readonly other: readonly Task[];
  };
  readonly toBeDeleted: readonly Task[];
}

export type PrepareTaskPurgeResult =
  | PrepareTaskPurgeResultNothingToPurge
  | PrepareTaskPurgeResultPurgeAllTasks
  | PrepareTaskPurgeResultPartialTasksPurge;

export const prepareTaskPurge = (tasks: readonly Task[], now: Date): PrepareTaskPurgeResult => {
  if (tasks.length === 0) {
    return  { type: 'NothingToPurge' };
  }

  const categorizedTasks = tasks.reduce(
    (acc, task) => {
      if (!task.completed && task.priority === 'high') {
        acc.important.push(task);
      }

      if (!task.completed && task.dueDate && task.dueDate < now) {
        acc.overdue.push(task);
      }

      if (!acc.important.includes(task) && !acc.overdue.includes(task)) {
        acc.other.push(task);
      }

      return acc;
    },
    { important: [] as Task[], overdue: [] as Task[], other: [] as Task[] }
  );

  if (categorizedTasks.other.length === tasks.length) {
    return { type: 'PurgeAllTasks', toBeDeleted: categorizedTasks.other };
  } else {
    return {
      type: 'PartialTasksPurge',
      categorizedTasks,
      toBeDeleted: categorizedTasks.other,
    };
  }
};
