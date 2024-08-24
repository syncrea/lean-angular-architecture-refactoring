import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { taskReducer } from './state/task.reducer';
import { provideEffects } from '@ngrx/effects';
import * as taskEffects from './state/task.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore({ tasks: taskReducer }),
    provideEffects([
      taskEffects
    ])
  ],
};
