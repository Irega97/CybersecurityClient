import { Encrypted } from './../models/encrypted';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class RsaService {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  env: Environment;

  constructor(private http:HttpClient) {
    this.env = new Environment();
   }

   getPublicServerKey(): any{
      return this.http.get(this.env.urlMain + '/rsa/server/pubkey');
   }

   sendPublicKey(pubKey){
     return this.http.post(this.env.urlMain + '/rsa/client/pubkey', pubKey);
   }

   postMensajeRSA(cipherText: object){
     return this.http.post(this.env.urlMain + '/rsa/post', cipherText);
   }

   getMensajeRSA(){
     return this.http.get<Encrypted>(this.env.urlMain + '/rsa/msg');
   }
}
