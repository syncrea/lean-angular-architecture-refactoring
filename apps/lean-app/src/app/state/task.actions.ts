import { createAction, props } from '@ngrx/store';

export const addTask = createAction('[Task] Add Task', props<{ title: string }>());
export const completeTask = createAction('[Task] Complete Task', props<{ taskId: number }>());
