import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonitorBarricaPage } from './monitor-barrica';

@NgModule({
  declarations: [
    MonitorBarricaPage,
  ],
  imports: [
    IonicPageModule.forChild(MonitorBarricaPage),
  ],
  exports: [
    MonitorBarricaPage
  ]
})
export class MonitorBarricaPageModule {}
