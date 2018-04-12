import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, App, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BarricaProvider, AjustesService } from '../../providers';
import { TabsPage, MonitorBarricaPage } from '../';
import { Barrica } from '../../class';

@IonicPage()
@Component({
  selector: 'page-barricas',
  templateUrl: 'barricas.html',
})
export class BarricasPage {

  escanear:boolean = false;
  codigo:string;
  muestra:boolean = false;
  barrica: Barrica = new Barrica();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private platform: Platform,
              private barcodeScanner: BarcodeScanner,
              private toastCtrl: ToastController,
              private _barricaService: BarricaProvider,
              private app: App,
              private _ajustesService: AjustesService,
              private alertCtrl: AlertController ) {

    this.escanearBarrica();
  }

  volver(){
    this.app.getRootNav().setRoot(TabsPage);
  }

  escanearBarrica(){

    this.scan().then(()=>{
      if( this._ajustesService.network){
        this._barricaService.getBarricaByCodigoRedline( this.codigo )
                            .then ( () => {

            this.cargar_datos_barrica();

          })
      }else{
        this._barricaService.getBarricaByCodigoStorage(this.codigo)
            .then( ()=>{
              this.cargar_datos_barrica();
            })
      }
    })

  }

  scan(){
    this.codigo = '';
    let promesa = new Promise( (resolve, reject )=>{
      console.log("Realizando scan");

      if(!this.platform.is('cordova')){
        this.codigo = '200509';
        resolve();
      }else{
        this.barcodeScanner.scan().then((barcodeData) => {
         // Success! Barcode data is here
         this.codigo = barcodeData.text;
         resolve();
        }, (err) => {
            // An error occurred
            console.error("Error: ", err );
            this.mostrarError("Error: " + err);
        });
      }
    })

    return promesa

  }

  mostrarError( mensaje:string ){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();

  }

  sacar_barrica(){
    this.muestra = false;
  }

  cargar_datos_barrica(){
    let barricaService: any =  this._barricaService.barrica;
    this.barrica.codigoBarrica = barricaService.codigoBarrica;
    this.barrica.descripcion = barricaService.descripcion;
    this.barrica.numeroInventario = barricaService.numeroInventario;
    this.barrica.origen = barricaService.origen;
    this.barrica.anioAdquisicion = barricaService.anioAdquisicion;
    this.barrica.capacidad = barricaService.capacidad;
    this.barrica.bosque = barricaService.bosque;
    this.barrica.sku = barricaService.sku;
    this.barrica.tipoEnologia = barricaService.tipoEnologia;
    this.barrica.toneleria = barricaService.toneleria;
    this.barrica.tostado = barricaService.tostado;
  }

  ver_monitor(){
    if (this._ajustesService.network){
      this.navCtrl.push( MonitorBarricaPage, {'codigo': this.codigo} );
    }else{
      this.showAlert('Sin conexión','El monitor no se puede ejecutar sin conexión');
    }
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
