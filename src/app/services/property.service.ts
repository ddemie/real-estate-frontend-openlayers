import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private propertiesUrl = '/api/properties';
  private scenariosUrl = '/api/scenarios';

  constructor(private http: HttpClient) {}

  getProperties(): Observable<any[]> {
    return this.http.get<any[]>(this.propertiesUrl);
  }

  getScenarios(): Observable<any[]> {
    return this.http.get<any[]>(this.scenariosUrl);
  }

  applyScenario(propertyId: number, scenarioId: number): Observable<any> {
    const url = `${this.propertiesUrl}/${propertyId}/apply-scenario/${scenarioId}`;
    return this.http.post<any>(url, {});
  }
}