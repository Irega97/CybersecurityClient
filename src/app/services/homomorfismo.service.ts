import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomomorfismoService {

  url;

  constructor(private http: HttpClient) { 
    this.url = 'http://localhost:3000/rsa/paillier';
  }

  getPaillierPubKey(): Observable<any>{
    return this.http.get(this.url);
  }

  postVotes(body: any): Observable<any> {
    return this.http.post(this.url, body);
  }
}
