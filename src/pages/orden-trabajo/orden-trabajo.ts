import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { OrdenesTrabajoProvider, AjustesService } from '../../providers';
import { OperacionesPage, TabsPage } from '../';

@IonicPage()
@Component({
  selector: 'page-orden-trabajo',
  templateUrl: 'orden-trabajo.html',
})
export class OrdenTrabajoPage {

  ordenes:any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _ordenesTrabajoProvider: OrdenesTrabajoProvider,
    private app: App,
    private _ajustesService: AjustesService,
    private loadingCtrl: LoadingController ) {

    let loader = this.loadingCtrl.create({
      content: "Cargando..."
    });
    loader.present();
    if(_ajustesService.network){
        this._ordenesTrabajoProvider.getAllOrdenesTrabajoRedline()
            .then(()=>{
              this.ordenes = this._ordenesTrabajoProvider.ordenes;
              loader.dismiss();
            })
      }else{
        this._ordenesTrabajoProvider.getAllOrdenesTrabajoStorage()
            .then(()=>{
              this.ordenes = this._ordenesTrabajoProvider.ordenes;
              loader.dismiss();
            })
      }

  }

  volver() {
    this.app.getRootNav().setRoot(TabsPage);
  }

  verOrden( orden:any ) {
    this._ordenesTrabajoProvider.getDetalleOperacionStorage(orden)
        .then(()=>{
          this.navCtrl.push(OperacionesPage, { codigoOrden: orden.numeroOrdenTrabajo });
        })
  }
}
