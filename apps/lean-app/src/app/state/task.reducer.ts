import { createReducer, on } from '@ngrx/store';
import { addTask, completeTask } from './task.actions';
import { Task } from '../task.model';

export interface TaskState {
  readonly tasks: readonly Task[];
}

export const initialState: TaskState = {
  tasks: [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: false },
  ]
};

export const taskReducer = createReducer(
  initialState,
  on(addTask, (state, { title }) => ({
    ...state,
    tasks: [...state.tasks, { id: state.tasks.length + 1, title, completed: false }]
  })),
  on(completeTask, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    )
  }))
);
