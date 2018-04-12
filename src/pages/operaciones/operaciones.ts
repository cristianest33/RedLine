import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController , Platform, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { OrdenesTrabajoProvider, GrupoBarricasProvider, AjustesService } from '../../providers';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { GrupoOperacionPage, OrdenTrabajoPage } from '../';

@IonicPage()
@Component({
  selector: 'page-operaciones',
  templateUrl: 'operaciones.html',
})
export class OperacionesPage {

  operacion: string = "trasiego";
  codigoOrden: number;
  id: number = 0;
  confirmaDestino: boolean = false;
  confirmaOrigen: boolean = false;
  codigo: string;
  grupo: any;
  cantidadConfirmada: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private _ordenesTrabajoProvider: OrdenesTrabajoProvider,
    private _grupoBarricaService: GrupoBarricasProvider,
    private _ajustesService: AjustesService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public modalCtrl : ModalController ) {

    this.codigoOrden = this.navParams.get("codigoOrden");

  }

  volver() {
    this.navCtrl.pop();
  }

  confirmarDestino(destino: any) {
    this.scan().then(()=>{
      if (destino.tipoDeposito === 'CUBAS') {
        console.log(this.codigo);
        if (parseInt(destino.codigoDeposito) === parseInt(this.codigo)) {
          this.confirmaDestino = true;
        } else {
          this.mostrarError('Error! El tanque seleccionado no coincide con la que se encuentra en la orden de trabajo.');
        }
      } else {
        if (this._ajustesService.network) {
          this._ordenesTrabajoProvider.getDetalleOperacionBarricaRedline(destino.id)
            .then(() => {
              this._grupoBarricaService.getGrupoBarricaFromBarricaRedline(this.codigo)
                .then(() => {
                  this.grupo = this._grupoBarricaService.grupo;
                  if (this.grupo.codigoGrupoBarrica === this._ordenesTrabajoProvider.detalleOperacion[0].codigoGrupoBarricas) {
                    this.confirmaDestino = true;
                  } else {
                    this.mostrarError('Error! La barrica seleccionada no coincide con la que se encuentra en la orden de trabajo.');
                  }
                })
            })
        } else {
          this._ordenesTrabajoProvider.getDetalleOperacionBarricaStorage(destino)
            .then(() => {
              this._grupoBarricaService.getGrupoBarricaFromBarricaStorage(this.codigo)
                .then(() => {
                  this.grupo = this._grupoBarricaService.grupo;
                  if (this.grupo.codigoGrupoBarrica === this._ordenesTrabajoProvider.detalleOperacion[0].codigoGrupoBarricas) {
                    this.confirmaDestino = true;
                  } else {
                    this.mostrarError('Error! La barrica seleccionada no coincide con la que se encuentra en la orden de trabajo.');
                  }
                })
            })

        }
      }
    })

  }

  confirmarOrigen(origen: any) {
    this.scan().then(()=>{
      console.log(origen.tipoDeposito);
      if (origen.tipoDeposito === 'CUBAS') {
        console.log(this.codigo);
        if (parseInt(origen.codigoDeposito) === parseInt(this.codigo)) {
          console.log('entra');
          this.confirmaOrigen = true;
        }else{
          this.mostrarError('Error! El tanque seleccionado no coincide con la que se encuentra en la orden de trabajo.');
        }
      } else {
        if (this._ajustesService.network) {
          console.log(origen);
          this._ordenesTrabajoProvider.getDetalleOperacionBarricaRedline(origen.id)
            .then(() => {
              this._grupoBarricaService.getGrupoBarricaFromBarricaRedline(this.codigo)
                .then(() => {
                  this.grupo = this._grupoBarricaService.grupo;
                  if (this.grupo.codigoGrupoBarrica === this._ordenesTrabajoProvider.detalleOperacion[0].codigoGrupoBarricas) {
                    this.confirmaOrigen = true;
                  }else{
                    this.mostrarError('Error! La barrica seleccionada no coincide con la que se encuentra en la orden de trabajo.');
                  }
                })
            })
        } else {
          this._ordenesTrabajoProvider.getDetalleOperacionBarricaStorage(origen)
            .then(() => {
              this._grupoBarricaService.getGrupoBarricaFromBarricaStorage(this.codigo)
                .then(() => {
                  this.grupo = this._grupoBarricaService.grupo;
                  if (this.grupo.codigoGrupoBarrica === this._ordenesTrabajoProvider.detalleOperacion[0].codigoGrupoBarricas) {
                    this.confirmaOrigen = true;
                  } else {
                    this.mostrarError('Error! La barrica seleccionada no coincide con la que se encuentra en la orden de trabajo.');
                  }
                })
            })
        }
      }
    })

  }

  scan() {

    console.log("Realizando scan");
    let promesa = new Promise((resolve, reject)=>{
      if (!this.platform.is('cordova')) {
        this.codigo = '2004';
        console.log("Realizando scan", this.codigo);
        resolve();
      }
      this.barcodeScanner.scan().then((barcodeData) => {
        this.codigo = barcodeData.text;
        resolve();
      }, (err) => {
        this.mostrarError("Error!: " + err);
      });
    })
    return promesa;

  }

  confirmar(tarea) {
    let idMovimiento = tarea.destino.idMovimiento;
    let idDetalle = tarea.destino.idDetalle;
    let merma=0;
    let borra=0;
    let parametroCodTarea = 633;
     console.log('Tarea ' ,tarea);
    console.log(idDetalle , ' ¡Mpvim ', idMovimiento);
    if (tarea.destino.tipoDeposito === 'CUBAS' || tarea.destino.tipoDeposito === 'BARRICA') {
      if (!this.confirmaDestino) {
        this.mostrarError('Error! Debe confirmar destino');
        return;
      }
    }

    if (tarea.origen.tipoDeposito === 'CUBAS' || tarea.origen.tipoDeposito === 'BARRICA') {
      if (!this.confirmaOrigen) {
        this.mostrarError('Error! Debe confirmar origen');
        return;
      }
    }

    if (this.cantidadConfirmada != tarea.origen.cantidadArticulo) {
      this.mostrarError('Error! Las cantidades de los insumos no coinciden');
      return;
    }
    
    if (tarea.destino.tipoComprobante === 32  || tarea.destino.tipoComprobante === 43 ){
      console.log('Ingresoooo');
       let modalSitio = this.modalCtrl.create( 'ModalSobrasPage', tarea );
       modalSitio.present();
    }else{
    let confirm = this.alertCtrl.create({
      title: '¿Esta seguro?',
      message: `Seguro desea confirmar la operación..`,
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
              
              this._ordenesTrabajoProvider.confirmaOperacionRedline(idMovimiento, idDetalle, merma, borra)
                .then(() => {
                  console.log('Mensaje ', this._ordenesTrabajoProvider.confirma.substr(0,2) );
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
              this._ordenesTrabajoProvider.confirmaOperacionStorage(idMovimiento, idDetalle,merma, borra);
              loader.dismiss();
              this.navCtrl.push(OrdenTrabajoPage);
            }
          }
        }
      ]
    });
    confirm.present();
  }
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
  

  verGrupo( tarea: any) {
    this._ordenesTrabajoProvider.getDetalleOperacionBarricaStorage(tarea)
      .then(() => {
        this.navCtrl.push(GrupoOperacionPage);
      })

  }

}
