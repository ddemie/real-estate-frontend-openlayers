// app.routes.ts
import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';

export const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'properties/:id', component: PropertyDetailsComponent },
];