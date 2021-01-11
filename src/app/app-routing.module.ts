import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { NonRepudiationComponent } from './components/non-repudiation/non-repudiation.component';
import { HomomorfismoComponent } from './components/homomorfismo/homomorfismo.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'nr',
    component: NonRepudiationComponent
  },
  {
    path: 'paillier',
    component: HomomorfismoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
