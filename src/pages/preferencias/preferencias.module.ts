import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreferenciasPage } from './preferencias';

@NgModule({
  declarations: [
    PreferenciasPage,
  ],
  imports: [
    IonicPageModule.forChild(PreferenciasPage),
  ],
  exports: [
    PreferenciasPage
  ]
})
export class PreferenciasPageModule {}
