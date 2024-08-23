export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  readonly priority?: TaskPriority;
  readonly dueDate?: Date;
}
