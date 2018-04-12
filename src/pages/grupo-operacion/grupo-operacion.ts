import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { OrdenesTrabajoProvider } from '../../providers';
import { GrupoBarrica } from '../../class';

@IonicPage()
@Component({
  selector: 'page-grupo-operacion',
  templateUrl: 'grupo-operacion.html',
})
export class GrupoOperacionPage {

  detalleOperacion: any[] = [];
  ver: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private platform: Platform,
              private _ordenesTrabajoProvider: OrdenesTrabajoProvider ) {

      this.detalleOperacion = this._ordenesTrabajoProvider.detalleOperacion;

  }

  volver(){
    this.navCtrl.pop();
  }

  mostrarError( mensaje:string ){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    });
    toast.present();
  }

}
