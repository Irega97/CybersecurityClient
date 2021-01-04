import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NonRepudiationTTPService {

  url;

  constructor(private http: HttpClient) {
    this.url = 'http://localhost:3001/ttp';
  }

  sendKey(json:any): Observable<any> {
    return this.http.post<any>(this.url, json);
  }
}
