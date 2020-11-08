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

  public decrypt(data) {
    console.log('Esto es el ciphertext: ', data.dataCipher);
    var message = CryptoJS.AES.decrypt(data.dataCipher, this.secretKey, { iv: data.iv }).toString(CryptoJS.enc.utf8);
    var msg = this.hex_to_ascii(message);
    console.log(`Esto es el mensaje recibido desencriptado: ${msg}`);
    return msg;
  }

  private hex_to_ascii(msg: string)
 {
	var hex  = msg.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
	return str;
 }
}