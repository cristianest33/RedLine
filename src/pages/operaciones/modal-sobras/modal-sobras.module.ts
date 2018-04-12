import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSobrasPage } from './modal-sobras';

@NgModule({
  declarations: [
    ModalSobrasPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalSobrasPage),
  ],
  exports: [
    ModalSobrasPage
  ]
})
export class ModalSobrasPageModule {}
