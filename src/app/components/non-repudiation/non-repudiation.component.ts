import { PublicKey } from './../../rsa/pubKey';
import { Component, OnInit } from '@angular/core';
import * as bc from 'bigint-conversion';
import { RSA as rsa } from '../../rsa/rsa';
import {NonRepudiationBService} from "../../services/non-repudiation-B.service";
import {NonRepudiationTTPService} from "../../services/non-repudiation-TTP.service";
import * as sha from 'object-sha';

@Component({
  selector: 'app-non-repudiation',
  templateUrl: './non-repudiation.component.html',
  styleUrls: ['./non-repudiation.component.css']
})
export class NonRepudiationComponent implements OnInit {

  rsa = new rsa();

  //Claves públicas
  keyPair;
  bPubKey;
  TTPPubKey;

  //AES
  cryptoKey;
  key;
  iv;

  //Mensaje
  mensaje: string; //Descifrado
  c: string; //Cifrado

  constructor(private nrBService: NonRepudiationBService, private nrTTPService: NonRepudiationTTPService) { }

  async ngOnInit() {
    //Generamos claves para cliente
    this.keyPair = await this.rsa.generateRandomKeys(2048);
    console.log("Claves generadas con éxito!");

    //Generamos key para cifrar mensaje con AES
    await crypto.subtle.generateKey({name: 'AES-CBC', length: 256}, true, ['encrypt', 'decrypt'])
      .then(data => this.cryptoKey = data);

    await crypto.subtle.exportKey("raw", this.cryptoKey)
      .then(data => this.key = bc.bufToHex(data));

    //Obtenemos clave pública del server B
    await this.nrBService.getPublicServerKey().subscribe((data) => {
      this.bPubKey = new PublicKey(bc.hexToBigint(data.e), bc.hexToBigint(data.n));
      console.log("B Public Key: {e: ", this.bPubKey.e, ", n: ", this.bPubKey.n, "}");
    })

    //Obtenemos clave pública del server TTP
    await this.nrTTPService.getPubKey().subscribe((data) => {
      this.TTPPubKey = new PublicKey(bc.hexToBigint(data.pubKey.e), bc.hexToBigint(data.pubKey.n));
      console.log("TTP Public Key: {e: ", this.TTPPubKey.e, ", n: ", this.TTPPubKey.n, "}");
    });  
  }

  /** Función encriptar mensaje */
  //Guarda el mensaje encriptado en c (criptograma)
  async encrypt() {
    this.iv = crypto.getRandomValues(new Uint8Array(16));
    await crypto.subtle.encrypt(
      {name: 'AES-CBC', iv: this.iv}, this.cryptoKey, bc.textToBuf(this.mensaje))
      .then(data => this.c = bc.bufToHex(data));
  }

  //Función que obtiene HASH del objeto pasado coomo parámetro
  async digest(obj) {
    return await sha.digest(obj, 'SHA-256');
  }

  po: string; //Proof origin
  pr: string; //Proof receive
  pko: string; //Proof of key origin
  pkp: string; //Proof of key publication

  /** Enviar mensaje a B */
  async sendMessage() {
    /** Encriptamos con AES el mensaje introducido **/
    await this.encrypt();

    /** Payload del body **/
    let body = {
      type: 1, //Primer mensaje
      src: 'A', //Cliente
      dst: 'B', //Servidor
      msg: this.c, //Mensaje
      timestamp: Date.now() //Timestamp
    };

    /** Encriptamos los datos con SHA-256 y lo firmamos con la clave privada del cliente**/
    await this.digest(body).then((data) => {
      let x = this.keyPair.privateKey.sign(bc.hexToBigint(data));
      this.po = bc.bigintToHex(x);
    });

    /* Payload de lo que vamos a enviar */
    let json = {
      body: body, //Datos de origen, destino y mensaje
      signature: this.po, //Firma del cliente para verificar identidad
      pubKey: { //Clave pública del cliente
        e: bc.bigintToHex(this.keyPair.publicKey.e),
        n: bc.bigintToHex(this.keyPair.publicKey.n)
      }
    };


    /** Enviamos datos al servidor **/
    this.nrBService.sendMessage(json).subscribe(
      async data => {
        let res = data; //Recibimos nuevo body (type:2), signature(pr=firma servidor) y clave publica server
        //Descifrar firma para obtener body hasheado
        let decrypted = await this.bPubKey.verify(bc.hexToBigint(res.signature));
        let proofDigest = bc.bigintToHex(decrypted);
        //Hasheamos body para comparar
        let bodyDigest = await this.digest(res.body);
        if (bodyDigest.trim() === proofDigest.trim()) {
          //Nuevos datos
          this.pr = res.signature; //Firma servidor
          let body = { //Mensaje para el TTP
            type: 3, 
            src: 'A', 
            dst: 'TTP', 
            key: this.key, 
            timestamp: Date.now()
          };

          //Hasheamos y firmamos el mensaje
          await this.digest(body).then((data) => {
            let y = this.keyPair.privateKey.sign(bc.hexToBigint(data));
            this.pko = bc.bigintToHex(y)
          });

          //Preparamos nuevos datos
          let json = {
            body: body, //Mensaje para TTP
            signature: this.pko, //Body para TTP firmado por el cliente
            pubKey: { //Clave pública del cliente
              e: bc.bigintToHex(this.keyPair.publicKey.e), 
              n: bc.bigintToHex(this.keyPair.publicKey.n)
            }
          };

          //Enviamos mensaje al TTP
          this.nrTTPService.sendKey(json).subscribe(
            async data => {
              //Firma del TTP con el body (mensaje type 4)
              let proofDigest = bc.bigintToHex(await this.TTPPubKey.verify(bc.hexToBigint(data.signature)));
              let bodyDigest = await this.digest(data.body);
              if (bodyDigest === proofDigest) {
                this.pkp = data.signature;
                console.log("All data verified by TTP");
                console.log({
                  pr: this.pr,
                  pkp: this.pkp
                });

                /** Muestra valores en el html */
                document.getElementById('proof-reception').innerHTML = this.pr as string;
                document.getElementById('proof-key-pub').innerHTML = this.pkp as string;
              }
              
            });

        } else {
          console.log("Bad authentication of proof of reception");
        }
      });
  }
}
