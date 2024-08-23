import { Component } from '@angular/core';
import { TaskListComponent } from './task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListComponent],
  template: `<app-task-list></app-task-list>`,
  styles: [`
    :host { display: block; }
  `]
})
export class AppComponent {}
