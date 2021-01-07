import { RsaBlinder } from './../../rsa/pubKey';
import { PublicKey } from '../../rsa/pubKey';
import { RSA as rsa } from '../../rsa/rsa';
import { AESEncDecService } from './../../services/aes-enc-dec.service';
import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { RsaService } from "../../services/rsa.service";
import { bigintToHex, hexToBigint, textToBigint, bigintToText } from 'bigint-conversion';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  rsa = new rsa();
  keyPair;
  pubKeyServer;
  blinder;

  constructor(private MainService: MainService, private AESEncDecService: AESEncDecService, private rsaService: RsaService) { }

  //Inicialización claves RSA
  async ngOnInit(): Promise<void> {
    //GENERAMOS CLAVES PARA RSA EN CLIENTE
    console.log("Generando claves . . .");
    await this.rsa.generateRandomKeys().then(data => {
      this.keyPair = data;
      console.log("Claves generadas con éxito!");
      console.log("e: ", this.keyPair.publicKey.e);
      console.log("n: ", this.keyPair.publicKey.n);
    });

    //RECOGEMOS CLAVE PÚBLICA DEL SERVIDOR
    await this.rsaService.getPublicServerKey().subscribe(data => {
      let e = hexToBigint(data.e);
      let n = hexToBigint(data.n);
      this.pubKeyServer = new PublicKey(e,n);
      console.log("e (server): ", this.pubKeyServer.e);
      console.log("n (server): ", this.pubKeyServer.n);
      
      //Creamos cegador con clave pública del server para firma ciega
      this.blinder = new RsaBlinder(this.pubKeyServer);
    });
  }

  //************************** AES *******************************
  // Criptografía simétrica

  name: string;
  nameRSA: string;
  frase: string;
  fraseRSA: string;
  timeout;
  hola;

  //Encripta mensaje y se lo envia al servidor
  public postMensaje(){
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

  //Obtiene el mensaje del servidor y lo descifra
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

  // Elimina el mensaje de pantalla
  public deleteMensaje(){
    setTimeout(
      () => {
        this.frase = '';
        this.fraseRSA = '';
      }, 3000);
  }

  //******************************** RSA *************************************
  // Criptografía asimétrica

  // Encriptamos mensaje con la clave pública del servidor y se lo enviamos
  public async postMensajeRSA() {
    if(this.pubKeyServer != undefined && this.nameRSA != undefined){
      let encryptedText = this.pubKeyServer.encrypt(textToBigint(this.nameRSA), true);
      console.log("Mensaje cifrado: ", encryptedText);
      let data = {dataCypher: bigintToHex(encryptedText)};
      this.rsaService.postMensajeRSA(data).subscribe(
        (res: any) => {
          this.fraseRSA = res.text;
        },
        err => console.log(err)
      );
    } else {
      console.log("Necesitas la clave del servidor");
    }
  }

  // Obtenemos el mensaje cifrado con nuestra clave pública y lo desencriptamos
  public async getMensajeRSA() {
    let pubKey = {
      "e": bigintToHex(this.keyPair.publicKey.e),
      "n": bigintToHex(this.keyPair.publicKey.n)
    }
    this.rsaService.sendPublicKey(pubKey).subscribe(() => {
      this.rsaService.getMensajeRSA().subscribe((data) => {
        let encrypted = data.encrypted;
        console.log("Mensaje cifrado: ", encrypted);
        let d = this.rsa.privateKey.decrypt(hexToBigint(encrypted));
        this.fraseRSA = bigintToText(d);
        console.log("Mensaje descifrado: ", this.fraseRSA);
      });
    }, error => {
        console.log("Clave no enviada. Error: ", error);
    })
    
  }

  // Función que envía clave pública del cliente al servidor
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

  // Envíamos mensaje al server para que lo firme. Obtenemos mensaje firmado del servidor y verificamos
  public async signMessage(){
    try{
      this.rsaService.sign({mensaje: bigintToHex(textToBigint(this.nameRSA))}).subscribe(data => {
        let signed = data.dataSigned;
        console.log("Server envia firmado: ", signed);
        let decrypted = this.pubKeyServer.verify(hexToBigint(signed));
        this.fraseRSA = bigintToText(decrypted);
        console.log("Mensaje verificado: ", this.fraseRSA);
      })
    } catch(err) {
      console.log("Error: ", err);
    }
  }

  //FIRMA CIEGA: Cegar el mensaje, que lo firme el server y desencriptarlo
  public async blindSignature(){
    try{
      let blindedMsg = this.blinder.blind(textToBigint(this.nameRSA));
      console.log("Mensaje cegado (hex): ", bigintToHex(blindedMsg));
      this.rsaService.sign({mensaje: bigintToHex(blindedMsg)}).subscribe(data => {
        const signedHex = data.dataSigned;
        console.log("Server envia firmado: ", signedHex);
        let sign = this.blinder.unblind(hexToBigint(signedHex));
        console.log("Mensaje descegado (bigint): ", sign);
        let decrypted = this.pubKeyServer.verify(sign);
        this.fraseRSA = bigintToText(decrypted);
        console.log("Mensaje verificado: ", this.fraseRSA);
      })
    } catch(err) {
      console.log("Error: ", err);
    }
  }
}


