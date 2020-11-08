import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AESEncDecService {

  constructor() { }

  secretKey = CryptoJS.enc.Hex.parse("4b173f3b3c2366674695d1a17a04752a");

  public encrypt(message: string) {
    var iv = CryptoJS.lib.WordArray.random(128/8);
    var cipherText = CryptoJS.AES.encrypt(message, this.secretKey, { iv: iv }).toString();
    console.log(`Mensaje cifrado: ${cipherText}`);
    let dataToSend = {
        cipherText: cipherText,
        iv: iv
    }
    return dataToSend;
  }

  public decrypt(cipherText: string, iv: string) {
    console.log(`Esto es el ciphertext: ${cipherText}`);
    var message = CryptoJS.AES.decrypt(cipherText, this.secretKey, { iv: iv }).toString(CryptoJS.enc.Utf8);
    console.log(`Esto es el mensaje recibido desencriptado: ${message}`);
    return message;
  }
}


//key: <Buffer 4b 17 3f 3b 3c 23 66 67 46 95 d1 a1 7a 04 75 2a>