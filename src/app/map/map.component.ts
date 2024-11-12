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
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MapComponent implements OnInit {
  map!: Map;
  properties: any[] = [];
  selectedProperty: any = null;

  isBrowser: boolean;
  scenarios: any[] = [];
  vectorSource: any;
  vectorLayer!: VectorLayer;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private propertyService: PropertyService,
    private currencyPipe: CurrencyPipe,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  goToPropertyDetails(propertyId: number): void {
    this.router.navigate(['/properties', propertyId]);
  }

  ngOnInit(): void {
    if (this.isBrowser && !this.map) { 
      this.initializeMap();
      this.loadProperties();
    }
  }

  initializeMap(): void {
    if (!this.map) {
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({ source: vectorSource });

      this.map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([-74.006, 40.7128]),
          zoom: 10,
        }),
      });

      this.vectorSource = vectorSource;
    }
  }

  loadProperties(): void {
    this.propertyService.getProperties().subscribe((data) => {
      this.properties = data;
      console.log("Properties loaded:", this.properties);
      this.addMarkers();
    });
  }

  addMarkers(): void {
    const vectorSource = new VectorSource();
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'assets/marker.png',
        scale: 0.5
      })
    });

    this.properties.forEach((property) => {
      const marker = new Feature({
        geometry: new Point(fromLonLat([property.longitude, property.latitude])),
        property: property
      });
      marker.setStyle(iconStyle);
      vectorSource.addFeature(marker);
    });

    this.vectorLayer = new VectorLayer({
      source: vectorSource,
      declutter: true
    });
    this.map.addLayer(this.vectorLayer);
    this.vectorLayer.setZIndex(10);

    // Listen for clicks on map features
    this.map.on('singleclick', (event) => {
      console.log('Map clicked at coordinates:', event.coordinate);
      this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const property = feature.get('property');
        if (property) {
          console.log('Property clicked:', property);
          this.showPropertyDetails(property);
        }
      });
    });
  }

  showPropertyDetails(property: any): void {
    this.selectedProperty = null;
    setTimeout(() => {
      this.selectedProperty = {
        ...property,
        formattedPrice: this.currencyPipe.transform(property.price, 'USD')
      };
    });
  }

  applyScenarioToProperty(propertyId: number, scenarioId: number): void {
    this.propertyService.applyScenario(propertyId, scenarioId).subscribe((result) => {
      console.log('Scenario applied:', result);
    });
  }
}