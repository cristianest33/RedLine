import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { GrupoBarricasProvider, AjustesService } from '../../providers/';
import { AlertController } from 'ionic-angular';
import { GrupoBarrica } from '../../class';

@IonicPage()
@Component({
  selector: 'page-detalle-grupo',
  templateUrl: 'detalle-grupo.html',
})
export class DetalleGrupoPage {

  barricas: number[] = [];
  grupo: any;
  ver: any;
  codigo: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private barcodeScanner: BarcodeScanner,
              private toastCtrl: ToastController,
              private platform: Platform,
              private _grupoBarricasProvider:GrupoBarricasProvider,
              private alertCtrl: AlertController,
              private _ajustesService: AjustesService ) {

    this.grupo = this.navParams.get('grupo');

  }

  volver(){
    this.navCtrl.pop();
  }

  sacar_barrica( barrica: any ){
    let confirm = this.alertCtrl.create({
      title: '¿Esta seguro?',
      message: `Va a sacar la barrica ${ barrica.codigoBarrica } del grupo ${ this.grupo.descripcionGrupoBarrica }`,
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
            if(this._ajustesService.network){
              this._grupoBarricasProvider.removeBarricaFromGrupoRedline( this.grupo.codigoGrupoBarrica, barrica.codigoBarrica );
            }else{
              this._grupoBarricasProvider.removeBarricaFromGrupoStorage( this.grupo.codigoGrupoBarrica, barrica.codigoBarrica );
            }
          }
        }
      ]
    });
    confirm.present();

  }

  agregarBarrica(){
    this.scan();
    this._grupoBarricasProvider.codigosBarricas.push(parseInt(this.codigo));
    let grupoBarrica = new GrupoBarrica();
    grupoBarrica.codigoGrupoBarrica = this.grupo.codigoGrupoBarrica;
    grupoBarrica.descripcionGrupoBarrica = this.grupo.descripcionGrupoBarrica;
    grupoBarrica.depositoAsociado = this.grupo.depositoAsociado;
    grupoBarrica.barricas = this._grupoBarricasProvider.codigosBarricas;
    if(this._ajustesService.network){
      this._grupoBarricasProvider.addBarricaToGrupoRedline(grupoBarrica);
    }else{
      this._grupoBarricasProvider.addBarricaToGrupoStorage(grupoBarrica);
    }
  }

  scan(){
    console.log("Realizando scan");

    if(!this.platform.is('cordova')){
      this.codigo = '200502';

      return;
    }
    this.barcodeScanner.scan().then((barcodeData) => {
     this.codigo = (barcodeData.text);
    }, (err) => {
        this.mostrarError("Error: " + err);
    });
  }

  mostrarError( mensaje:string ){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    });
    toast.present();
  }

  ver_barrica( i ){
    this.ver = i;
  }

  ocultar_barrica(){
    this.ver = null;
  }

  showAlert( titulo:string, mensaje:string ) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['OK']
    });
    alert.present();
  }


}
