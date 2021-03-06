import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NonRepudiationComponent } from 'src/app/components/non-repudiation/non-repudiation.component';
import { HomomorfismoComponent } from './components/homomorfismo/homomorfismo.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NonRepudiationComponent,
    HomomorfismoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
