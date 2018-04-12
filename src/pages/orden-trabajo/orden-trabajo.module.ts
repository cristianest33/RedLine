import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdenTrabajoPage } from './orden-trabajo';

@NgModule({
  declarations: [
    OrdenTrabajoPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdenTrabajoPage),
  ],
  exports: [
    OrdenTrabajoPage
  ]
})
export class OrdenTrabajoPageModule {}
