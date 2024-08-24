import { Component } from '@angular/core';
import { TaskListContainerComponent } from "./task-list-container.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListContainerComponent],
  template: `<app-task-list-container></app-task-list-container>`,
  styles: [`
    :host { display: block; }
  `]
})
export class AppComponent {}
