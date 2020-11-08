import { Environment } from './environment';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  env: Environment;

  constructor(private http:HttpClient) {
    this.env = new Environment();
   }

   postMensaje(cipherText: object){
     return this.http.post(this.env.urlMain + '/post', cipherText);
   }

   getMensaje(): Observable<object>{
     return this.http.get<object>(this.env.urlMain + '/msg');
   }
}
