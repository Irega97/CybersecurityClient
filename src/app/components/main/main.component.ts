import * as CryptoJS from 'crypto-js';
import { AESEncDecService } from './../../services/aes-enc-dec.service';
import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import {RsaService} from "../../services/rsa.service";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private MainService: MainService, private AESEncDecService: AESEncDecService, private RsaService: RsaService) { }

  ngOnInit(): void {
  }

  //************************** AES *******************************

  name: string;
  frase: string;
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

  public postMensajeRSA(event){//editado por Sara (estaba vacio) + he añadido RsaService
    const encryptedText = this.RsaService.encrypt(this.name);
    this.MainService.postMensaje(encryptedText).subscribe(
      res => {
        console.log(res);
        this.hola = res;
        this.frase = this.hola.text;
      },
      err => console.log(err)
    );

  }

  public getMensajeRSA(){ //editado por Sara (estaba vacio)
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

}


