import { createAction, props } from '@ngrx/store';
import { TaskPriority } from '../task.model';

export const addTask = createAction('[Task] Add Task', props<{ title: string; priority: TaskPriority }>());
export const completeTask = createAction('[Task] Complete Task', props<{ taskId: string; completed?: boolean }>());
export const deleteTask = createAction('[Task] Delete Task', props<{ taskId: string }>());
