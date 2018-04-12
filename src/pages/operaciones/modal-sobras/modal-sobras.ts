import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController,
   LoadingController, AlertController, ToastController } from 'ionic-angular';
import { OrdenTrabajoPage } from '../..';
import { AjustesService, OrdenesTrabajoProvider } from '../../../providers/index';
/**
 * Generated class for the ModalSobrasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-sobras',
  templateUrl: 'modal-sobras.html',
})
export class ModalSobrasPage {  
  datos = {
    merma : 0,
    borra: 0,
  }
  tarea:any;
  estadoInput: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,
     private viewCtrl : ViewController,
     private toastCtrl: ToastController,
     private _ordenesTrabajoProvider: OrdenesTrabajoProvider,
     private _ajustesService: AjustesService,
     private alertCtrl: AlertController,
     private loadingCtrl: LoadingController,) {
    this.tarea = this.navParams.data;
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  guardar(forma: any) {
   
    let idMovimiento = this.tarea.destino.idMovimiento;
    let idDetalle = this.tarea.destino.idDetalle;
  
      if (this.tarea.destino.cantidadArticulo >= (Number(this.datos.borra) + Number(this.datos.merma))){
     
    let confirm = this.alertCtrl.create({
      title: '¿Esta seguro?',
      message: `Seguro desea confirmar la operación modal`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            return;
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            let loader = this.loadingCtrl.create({
              content: "Confirmando..."
            });
            loader.present();
            if(this._ajustesService.network){
              this._ordenesTrabajoProvider.confirmaOperacionRedline(idMovimiento, idDetalle,  this.datos.merma,  this.datos.borra)
                .then(() => {
               
                  if (this._ordenesTrabajoProvider.confirma.substr(0,2) === 'OK'){
                    this.mostrarErrorAceptar('La tarea fue confirmada con éxito', this._ordenesTrabajoProvider.confirma);
                    loader.dismiss();
                    this.navCtrl.push(OrdenTrabajoPage);

                  }else{
                    this.mostrarErrorAceptar('Error' , this._ordenesTrabajoProvider.confirma);
                    loader.dismiss();
                    //this.navCtrl.push(OrdenTrabajoPage);
                  }
                })
            }else{
              this._ordenesTrabajoProvider.confirmaOperacionStorage(idMovimiento, idDetalle, this.datos.merma,  this.datos.borra);
              loader.dismiss();
              this.navCtrl.push(OrdenTrabajoPage);
            }
          }
        }
      ]
    });
    confirm.present();
    }else{
      this.mostrarError('Error! El los litros ingresado en la merma + borra son  mayores a la cantidad actual.');
     
    }
  } 
  
  activarInput(estadoInput:boolean){
    this.estadoInput=estadoInput;
   
  }

  mostrarError(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();

  }


  mostrarErrorAceptar(titulo: string, mensaje: string){
    let confirm = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            return;
          }
        }
      ]
    });
    confirm.present();
  }
  



}
