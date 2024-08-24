import { createAction, props } from '@ngrx/store';
import { Task, TaskPriority } from '../task.model';

export const addTask = createAction('[Task] Add Task', props<{ title: string; priority: TaskPriority }>());
export const completeTask = createAction('[Task] Complete Task', props<{ taskId: string; completed?: boolean }>());
export const deleteTask = createAction('[Task] Delete Task', props<{ taskId: string }>());
export const purgeTasks = createAction('[Task] Purge Tasks', props<{ tasks: Task[] }>());
export const updateMessages = createAction('[Task] Update Messages', props<{ messages: string[] }>());
