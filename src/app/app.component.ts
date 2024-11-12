// app.component.ts
import { Component } from '@angular/core';
import { MapComponent } from "./map/map.component";
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent, RouterModule], // Add RouterModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'real-estate-frontend';
}