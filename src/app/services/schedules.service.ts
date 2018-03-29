import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SchedulesService {
  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getSchedule(facility, date) {
      return this.http.get(this.apiUrl + '/api/schedules/'+facility+'/'+date);
  }
}
