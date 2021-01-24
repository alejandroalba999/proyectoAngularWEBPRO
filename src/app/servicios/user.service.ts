import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'https://api.weatherbit.io/v2.0/alerts?lat=39.75895&lon=-84.19161&key=d5665b7e5dad43bd958140e97c7ce5da';
  constructor(private http: HttpClient) { }

  getClima() {
    return this.http.get(`${this.url}`).toPromise();
  }
}