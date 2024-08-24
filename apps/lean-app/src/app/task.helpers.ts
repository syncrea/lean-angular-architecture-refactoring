import { Task } from './task.model';

export const getImportantTasks = (tasks: readonly Task[], now: Date) => tasks.filter(
  (task) =>
    !task.completed &&
    (task.priority === 'high' || (task.dueDate && task.dueDate < now))
);

export const isTaskOverdue = (task: Task, now: Date) => task.dueDate && task.dueDate < now;
