import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, App } from 'ionic-angular';
import { OrdenTrabajoPage, GruposPage, BarricasPage } from '../';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private menuCtrl: MenuController,
              private app: App ) {

      this.menuCtrl.enable(true);
  }

  irOrdenes(){
    this.app.getRootNav().setRoot(OrdenTrabajoPage);
  }

  irGrupos(){
    this.app.getRootNav().setRoot(GruposPage);
  }

  irBarrica(){
    this.app.getRootNav().setRoot(BarricasPage);
  }

}
