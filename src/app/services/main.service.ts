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

   postMensaje(text: string){
     let c = typeof(text);
     console.log(c);
     return this.http.post(this.env.urlMain + '/post', {text, headers:this.headers});
   }

   getMensaje(): Observable<string>{
     return this.http.get<string>(this.env.urlMain + '/msg');
   }
}
