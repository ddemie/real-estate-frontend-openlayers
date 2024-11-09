// main.ts
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // Import the app configuration

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));