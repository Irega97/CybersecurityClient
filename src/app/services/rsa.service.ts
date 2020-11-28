import { Injectable } from '@angular/core';

import MyRsa from 'my-rsa';

const bigint_conversion = require('bigint-conversion');
const bigintToHex = bigint_conversion.bigintToHex;
const hexToBigint = bigint_conversion.hexToBigint;
const textToBigint =  bigint_conversion.textToBigint;
const BigintToText = bigint_conversion.bigintToText;

const rsa = new MyRsa();
let mensaje: string;

@Injectable({
  providedIn: 'root'
})
export class RsaService {

  constructor() {
  }

  public async encrypt(mensaje: string) {

      if(mensaje==null) mensaje = "Introduce tu nombre";
      console.log('Petición GET realizada');

      let msg = textToBigint(mensaje); //convierte string a bigint

      if (!rsa.publicKey){
        await rsa.generateKeys(1024);
      }

      let key = rsa.publicKey;
      let e = key.e;
      let n = key.n;
      let datacypher = MyRsa.encrypt(msg,e,n);

      let dataToSend = {
        dataCypher: bigintToHex(datacypher),
        e: bigintToHex(e),
        n: bigintToHex(n)
      };

      console.log("GET CLIENT: " + dataToSend.dataCypher);
      console.log("GET e CLIENT: " + dataToSend.e);
      console.log("GET n CLIENT: " + dataToSend.n);

    return dataToSend;
  }

  public async decrypt(msgEncrypted) {
    let msgHEX = msgEncrypted.mensajeServer;
    let msg = hexToBigint(msgHEX);
    console.log('Petición POST realizada! Mensaje cifrado:', msg);

    if (!rsa.privateKey){
      await rsa.generateKeys(1024);
    }

    let key = rsa.privateKey;
    let d = key.d;
    let n = key.n;

    mensaje = BigintToText(MyRsa.decrypt(msg, d, n));

    let dataCliente = {
      mensaje: bigintToHex(mensaje),
      d: bigintToHex(d),
      n: bigintToHex(n)
    };

    console.log("Mensaje descifrado: " + dataCliente.mensaje);
    console.log("Private exponent d: " + dataCliente.d);
    console.log("Public modulus n: " + dataCliente.n);

    return mensaje;
  }

}
