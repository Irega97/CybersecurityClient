import { AESEncDecService } from './../../services/aes-enc-dec.service';
import { bodyParser } from 'body-parser';
import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  name: string;
  frase: string;
  timeout;

  constructor(private MainService: MainService, private AESEncDecService: AESEncDecService) { }

  ngOnInit(): void {
  }

  public postMensaje(event){
    console.log(this.name);
    const encryptedText = this.AESEncDecService.encrypt(this.name);
    this.MainService.postMensaje(encryptedText).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

  public getMensaje(){
    this.MainService.getMensaje().subscribe(
      (data) => {
        this.frase = data;
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

  private encryptMensaje(){

  }

  private decryptMensaje(){

  }

}


