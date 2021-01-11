import { HomomorfismoService } from './../../services/homomorfismo.service';
import { Component, OnInit } from '@angular/core';
import * as paillier from 'paillier-bigint';
import * as bc from 'bigint-conversion';

@Component({
  selector: 'app-homomorfismo',
  templateUrl: './homomorfismo.component.html',
  styleUrls: ['./homomorfismo.component.css']
})
export class HomomorfismoComponent implements OnInit {

  publicKey;

  votesA = 0;
  votesB = 0;
  votesC = 0;
  votesD = 0;
  votesE = 0;

  totalVotes = [];
  totalResults;

  constructor(private homoService: HomomorfismoService) { }

  ngOnInit(): void {
    this.homoService.getPaillierPubKey().subscribe(data => {
      this.publicKey = new paillier.PublicKey(
        bc.hexToBigint(data.n),
        bc.hexToBigint(data.g)
      );
      console.log(this.publicKey);
    });
  }

  async voteA(){
    this.votesA++;
    const A = BigInt(10000);
    const encryptedA = await this.publicKey.encrypt(A);
    this.totalVotes.push(encryptedA);
    console.log('Votos encriptados: ', this.totalVotes);
  }

  async voteB(){
    this.votesB++;
    const B = BigInt(1000);
    const encryptedA = await this.publicKey.encrypt(B);
    this.totalVotes.push(encryptedA);
    console.log('Votos encriptados: ', this.totalVotes);
  }

  async voteC(){
    this.votesC++;
    const C = BigInt(100);
    const encryptedA = await this.publicKey.encrypt(C);
    this.totalVotes.push(encryptedA);
    console.log('Votos encriptados: ', this.totalVotes);
  }

  async voteD(){
    this.votesD++;
    const D = BigInt(10);
    const encryptedA = await this.publicKey.encrypt(D);
    this.totalVotes.push(encryptedA);
    console.log('Votos encriptados: ', this.totalVotes);
  }

  async voteE(){
    this.votesE++;
    const E = BigInt(1);
    const encryptedA = await this.publicKey.encrypt(E);
    this.totalVotes.push(encryptedA);
    console.log('Votos encriptados: ', this.totalVotes);
  }

  async getAllVotes(){
    if(this.totalVotes.length == 0){
      console.log("No hay votos");
    } else {
      let totalEncrypted = BigInt(1);
      for (let i in this.totalVotes) {
        totalEncrypted = await this.publicKey.addition(this.totalVotes[i], totalEncrypted);
      }
      console.log('Total votos encriptados');
      console.log(totalEncrypted);
      const message = {
        totalEncrypted: bc.bigintToHex(totalEncrypted)
      }
      this.homoService.postVotes(message).subscribe(res => {
        this.totalResults = bc.hexToBigint(res.msg);
        const votes = ("0000" + this.totalResults).slice(-5);
        console.log('Total votos: ' + votes);
        const digits = this.totalResults.toString().split('');
        console.log("digits: " + digits);
        console.log('Votos PP: ' + digits[0]);
        console.log('Votos PSOE: ' + digits[1]);
        console.log('Votos PODEMOS: ' + digits[2]);
        console.log('Votos VOX: ' + digits[3]);
        console.log('Votos PACMA: ' + digits[4]);
      });
    }
  }
}
