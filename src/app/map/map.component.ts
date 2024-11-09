// map.component.ts

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PropertyService } from '../services/property.service';
import { Feature, Map, View } from 'ol';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { CurrencyPipe } from '@angular/common'; // Add CurrencyPipe here if used in template

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true, // Make the component standalone
  imports: [CommonModule] // Import CommonModule and any other necessary modules
})
export class MapComponent implements OnInit {
  map!: Map;
  properties: any[] = [];
  selectedProperty: any = null;

  isBrowser: boolean;
  scenarios: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private propertyService: PropertyService,
    private currencyPipe: CurrencyPipe // Inject CurrencyPipe if used in template
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    console.log("MapComponent initialized"); // Debug line
    if (this.isBrowser) {
      this.initializeMap();
      this.loadProperties();
    }
  }

  initializeMap(): void {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });
  
    this.map = new Map({
      target: 'map', // This should match the ID in your HTML
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([-74.006, 40.7128]), // Adjust as needed
        zoom: 10
      })
    });

    // Initialize the OpenLayers map with an OSM (OpenStreetMap) layer
    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([-74.006, 40.7128]), // Default to New York City
        zoom: 10
      })
    });
  }

  loadProperties(): void {
    this.propertyService.getProperties().subscribe((data) => {
      this.properties = data;
      this.addMarkers();
    });
  }

  loadScenarios(): void {
    this.propertyService.getScenarios().subscribe((data) => {
      this.scenarios = data;
    });
  }

  addMarkers(): void {
    const vectorSource = new VectorSource();
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'assets/marker.png', // Path to your marker icon
        scale: 0.5 // Adjust scale to 0.5 for a 16x16 size if the original is 32x32 pixels
      })
    });

    // Add a marker for each property
    this.properties.forEach((property) => {
      const marker = new Feature({
        geometry: new Point(fromLonLat([property.longitude, property.latitude])),
        property: property
      });
      marker.setStyle(iconStyle);
      vectorSource.addFeature(marker);
    });

    // Add the vector source to a new layer
    this.map.addLayer(
      new VectorLayer({
        source: vectorSource
      })
    );

    // Set up a click handler to show property details
    this.map.on('click', (event) => {
      this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
        this.selectedProperty = feature.get('property');
        this.showPropertyDetails(this.selectedProperty);
      });
    });
  }

  showPropertyDetails(property: any): void {
    this.selectedProperty = property;
    // Format the price using CurrencyPipe
    this.selectedProperty.formattedPrice = this.currencyPipe.transform(
      this.selectedProperty.price,
      'USD'
    );
  }

  applyScenarioToProperty(propertyId: number, scenarioId: number): void {
    this.propertyService.applyScenario(propertyId, scenarioId).subscribe((result) => {
      console.log('Scenario applied:', result);
    });
  }
}