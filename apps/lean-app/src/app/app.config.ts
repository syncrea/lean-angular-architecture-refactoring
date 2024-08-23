import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { taskReducer } from './state/task.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(StoreModule.forRoot({ tasks: taskReducer }))
  ],
};
