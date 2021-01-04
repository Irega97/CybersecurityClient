import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { Environment } from './environment';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class NonRepudiationBService {

  env: Environment;
  url;

  constructor(private http:HttpClient) {
    this.env = new Environment();
    this.url = this.env.urlMain + '/rsa/nonrep';
  }

  sendMessage(json:any): Observable<any> {
    return this.http.post<any>(this.url, json);
  }
}
