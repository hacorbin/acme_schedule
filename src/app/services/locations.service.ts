import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class LocationsService {
  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getLocations() {
      return this.http.get(this.apiUrl + '/api/locations');
  }
}
