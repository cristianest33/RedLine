import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OperacionesPage } from './operaciones';

@NgModule({
  declarations: [
    OperacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(OperacionesPage),
  ],
  exports: [
    OperacionesPage
  ]
})
export class OperacionesPageModule {}
