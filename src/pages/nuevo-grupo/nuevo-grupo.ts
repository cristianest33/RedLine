import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { GrupoBarricasProvider, AjustesService } from '../../providers';
import { GrupoBarrica } from '../../class';

@IonicPage()
@Component({
  selector: 'page-nuevo-grupo',
  templateUrl: 'nuevo-grupo.html',
})
export class NuevoGrupoPage {

  barricas: number[] = [] ;
  descripcion:string = '';
  depositoAsociado:string;
  codigoDeposito: any;
  depositoAsociadoAlertOpts: { title: string, subTitle: string };
  depositosAsociados: any[] = [];
  codigo: string;

  constructor( public navCtrl: NavController,
               public navParams: NavParams,
               private barcodeScanner: BarcodeScanner,
               private toastCtrl: ToastController,
               private platform: Platform,
               private _grupoBarricasProvider:GrupoBarricasProvider,
               private _ajustesService: AjustesService ) {

    if(this._ajustesService.network){
      this._grupoBarricasProvider.getAllDepositosAsociadosRedline()
                                 .then( ()=> {
        this.depositosAsociados = this._grupoBarricasProvider.depositos;

      })
    }else{
      this._grupoBarricasProvider.getAllDepositosAsociadosStorage().then( ()=>{
        this.depositosAsociados = this._grupoBarricasProvider.depositos;
      })
    }

    this.depositoAsociadoAlertOpts = {
      title: 'Deposito Asociado',
      subTitle: 'Seleccione deposito asociado'
    };
  }

  volver(){
    this.navCtrl.pop();
  }

  agregarBarrica() {
    this.scan().then(()=>{
      this.barricas.push(parseInt(this.codigo));
    });

  }

  scan(){
    this.codigo = '';
    let promesa = new Promise((resolve, reject)=>{
      if(!this.platform.is('cordova')){
        this.codigo = '200502';

        resolve();
      }else{
        this.barcodeScanner.scan().then((barcodeData) => {
        this.codigo = barcodeData.text;
        resolve();
        }, (err) => {

            this.mostrarError("Error: " + err);
        });
      }


    })

    return promesa;

  }

  mostrarError( mensaje:string ){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    });
    toast.present();

  }

  sacar_barrica(i){
    this.barricas.splice(i);
  }

  selDeposito(codigoDeposito){
    this.codigoDeposito = codigoDeposito;
  }

  guardar_grupo(){
    let grupoBarrica = new GrupoBarrica();
    grupoBarrica.descripcionGrupoBarrica = this.descripcion;
    grupoBarrica.depositoAsociado = parseInt(this.codigoDeposito);
    grupoBarrica.barricas = this.barricas;
    console.log(grupoBarrica.depositoAsociado);
    if(this._ajustesService.network){
      this._grupoBarricasProvider.saveGrupoBarricaRedline(grupoBarrica)
        .then(()=>{
          this.mostrarError('El grupo se ha generado con exito');
          this.navCtrl.push(GrupoBarrica);
        })
        .catch(()=>{
          this.mostrarError('Error al generar el grupo. Verifique e intentelo de nuevo');
        })
    }else{
      this._grupoBarricasProvider.saveGrupoBarricaStorage(grupoBarrica);
    }
  }


}
