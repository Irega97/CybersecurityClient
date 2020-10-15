import { bodyParser } from 'body-parser';
import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  name: string;
  frase: string;
  timeout;

  constructor(private MainService: MainService) { }

  ngOnInit(): void {
  }

  public postMensaje(event){
    console.log(this.name)
    this.MainService.postMensaje(this.name).subscribe(
      res => console.log(res),
      err => console.log(err)
    )
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

}
