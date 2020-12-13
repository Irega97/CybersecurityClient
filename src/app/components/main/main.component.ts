import { generateKeyPair } from 'crypto';
import { PublicKey } from './../rsa/pubKey';
import { RSA as rsa } from './../rsa/rsa';
import * as CryptoJS from 'crypto-js';
import { AESEncDecService } from './../../services/aes-enc-dec.service';
import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import {RsaService} from "../../services/rsa.service";
import { bigintToHex, hexToBigint, textToBigint } from 'bigint-conversion';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  rsa = new rsa();
  keyPair;
  pubKeyServer;

  constructor(private MainService: MainService, private AESEncDecService: AESEncDecService, private rsaService: RsaService) { }

  async ngOnInit(): Promise<void> {
    console.log("Generando claves . . .");
    await this.rsa.generateRandomKeys().then(data => {
      this.keyPair = data;
      console.log("Claves generadas con éxito!");
      console.log("e: ", this.keyPair.publicKey.e);
      console.log("n: ", this.keyPair.publicKey.n);
    });
    await this.rsaService.getPublicServerKey().subscribe(data => {
      let e = hexToBigint(data.e);
      let n = hexToBigint(data.n);
      this.pubKeyServer = new PublicKey(e,n);
      console.log("e (server): ", this.pubKeyServer.e);
      console.log("n (server): ", this.pubKeyServer.n);
    });
    /* await this.sendPublicKey().then(() =>{
      console.log("Clave enviada con éxito");
    }, (error) => {
      console.log("Clave no enviada. Error: ", error);
    }); */
  }

  //************************** AES *******************************

  name: string;
  nameRSA: string;
  frase: string;
  fraseRSA: string;
  timeout;
  hola;

  public postMensaje(event){
    const encryptedText = this.AESEncDecService.encrypt(this.name);
    this.MainService.postMensaje(encryptedText).subscribe(
      res => {
        console.log(res);
        this.hola = res;
        this.frase = this.hola.text;
      },
      err => console.log(err)
    );
  }

  public getMensaje(){
    this.MainService.getMensaje().subscribe(
      (data) => {
        this.frase = this.AESEncDecService.decrypt(data).toString();
        console.log(this.frase);
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  public deleteMensaje(){
    setTimeout(
      () => {
        this.frase = '';
      }, 3000);
  }

  //**************************************************************************
  //******************************** RSA *************************************

  public async postMensajeRSA() {
    if(this.pubKeyServer != undefined && this.nameRSA != undefined){
      console.log("Clave server: ", this.pubKeyServer);
      let encryptedText = this.pubKeyServer.encrypt(textToBigint(this.nameRSA));
      console.log(encryptedText);
      let data = {dataCypher: encryptedText};
      this.rsaService.postMensajeRSA(data).subscribe(
        res => {
          console.log(res);
          /* this.hola = res;
          this.fraseRSA = this.hola.text; */
        },
        err => console.log(err)
      );
    } else {
      console.log("Necesitas la clave del servidor");
    }
  }

  public async getMensajeRSA() {
    /* (await this.rsaService.postPublicKey(this.keyPair.publicKey)).subscribe((data) =>{
      this.pubKeyServer = new PublicKey(data['e'],data['n']);
      console.log(this.pubKeyServer);
    }); */
    /* await this.postPublicKey(this.keyPair.publicKey); */
    this.rsaService.getMensajeRSA().subscribe((data) => {
      let encrypted = data.dataCypher;
      console.log("Mensaje cifrado: ", encrypted);
      this.fraseRSA = this.rsa.privateKey.decrypt(encrypted);
      console.log("Mensaje descifrado: ", this.fraseRSA);
    });
  }

  public async sendPublicKey(){
    try{
      let data = {
        "e": bigintToHex(this.keyPair.publicKey.e),
        "n": bigintToHex(this.keyPair.publicKey.n)
      }
      this.rsaService.sendPublicKey(data);
      console.log("Clave enviada con éxito");
    } catch(err) {
      console.log("Error: ", err);
    }
  }

}


