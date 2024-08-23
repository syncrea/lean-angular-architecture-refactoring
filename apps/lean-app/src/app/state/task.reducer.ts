import { createReducer, on } from '@ngrx/store';
import { addTask, completeTask, deleteTask } from './task.actions';
import { Task } from '../task.model';
import { generateRandomId } from '../helpers';

export interface TaskState {
  readonly tasks: Record<string, Task>;
}

export const initialState: TaskState = {
  tasks: {
    '1': { id: '1', title: 'Learn Angular', priority: 'low', completed: false },
    '2': { id: '2', title: 'Learn Nx', priority: 'low', completed: false, dueDate: new Date('2022-01-01') },
    '3': { id: '3', title: 'Learn Ngrx', priority: 'high', completed: false }
  }
};

export const taskReducer = createReducer(
  initialState,
  on(addTask, (state, { title, priority }) => {
    const id = generateRandomId();
    return {
      ...state,
      tasks: {
        ...state.tasks,
        [id]: { id, title, priority, completed: false }
      }
    };
  }),
  on(completeTask, (state, { taskId, completed = true }) => {
    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...state.tasks[taskId],
          completed
        }
      }
    };
  }),
  on(deleteTask, (state, { taskId }) => {
    const { [taskId]: _deleted, ...tasks } = state.tasks;
    return {
      ...state,
      tasks
    };
  })
);
