import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AESEncDecService {
  static encrypt(name: string) {
    throw new Error('Method not implemented.');
  }


  secretKey = "4b173f3b3c2366674695d1a17a04752a";

  constructor() { }
  
  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}


//key: <Buffer 4b 17 3f 3b 3c 23 66 67 46 95 d1 a1 7a 04 75 2a>