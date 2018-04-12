import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrupoOperacionPage } from './grupo-operacion';

@NgModule({
  declarations: [
    GrupoOperacionPage,
  ],
  imports: [
    IonicPageModule.forChild(GrupoOperacionPage),
  ],
  exports: [
    GrupoOperacionPage
  ]
})
export class GrupoOperacionPageModule {}
