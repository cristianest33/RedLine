import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AjustesService } from '../ajustes/ajustes';
import { URL_SERVICIOS } from '../../config/url.services';
import { AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Barrica } from '../../class';


@Injectable()
export class BarricaProvider {

  constructor( private http: Http ,
               private alertCtrl: AlertController,
               private platform: Platform,
               private storage: Storage,
               private _ajustesService: AjustesService ) {

    console.log('Hello BarricaProvider Provider');
  }


  barricas:Barrica[] = [];
  barrica: any;
  movimiento: any;

  getAllBarricasRedline(){
    let promesa = new Promise( (resolve, reject) => {
      this.barricas = [];
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/getAllBarricas`;
      this.http.get( url )
               .map( resp => resp.json())
               .subscribe( data => {
                 if( data.error ){
                     this.showAlert('Barricas', 'Ha ocurrido un error.');
                 }else{
                   this.barricas.push(...data);
                   this.setAllBarricasStorage();
                   resolve();
                 }
               })
    });
    return promesa;
  }

  getAllBarricasStorage() {
    let promesa = new Promise((resolve, reject)=>{
    if (this.platform.is("cordova")) {
      //Dispositivo
      this.storage.get("barricas")
        .then((barricas) => {
            if(barricas){
              this.barricas = barricas;
            }
            resolve();
        });
    } else {
      //Escritorio
      if (localStorage.getItem('barricas')) {
        this.barricas = JSON.parse(localStorage.getItem('barricas'));
      }
      resolve();
      }
    });
    return promesa;
  }

  getBarricaByCodigoRedline( codigo: string ){
    let promesa = new Promise( ( resolve, reject ) => {
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/getBarricaByCodigo?codigo=${codigo}` ;
      this.http.get( url )
               .map( resp => resp.json() )
               .subscribe( data => {
                  if( data.error ){
                    //Aqui hay un problema
                  }else{
                    this.barrica = data;
                    resolve();
                  }
                })

    })
    return promesa;
  }

  getBarricaByCodigoStorage( codigo: string ){
    let promesa = new Promise( (resolve, reject)=>{
        for (let i=0; i < this.barricas.length; i++){
         if (this.barricas[i]['codigoBarrica'] === parseInt(codigo)){
           this.barrica = this.barricas[i];
           console.log(this.barrica);
           resolve();
         }
        }
    })
    return promesa
  }

  getMovimientoVasija( codigo: string ) {
    let promesa = new Promise( ( resolve, reject ) => {
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/getMovimientoVasija?codigo=${codigo}` ;
      this.http.get( url )
               .map( resp => resp.json() )
               .subscribe( data => {
                  if( data.error ){
                    //Aqui hay un problema
                  }else{
                    this.movimiento = data;
                    resolve();
                  }
                })

    })
    return promesa;
  }

  setAllBarricasStorage() {
    if (this.platform.is("cordova")) {
      //Dispositivo
      this.storage.ready()
        .then(() => {
          this.storage.set('barricas', this.barricas);
        })
    } else {
      //Escritorio
      localStorage.setItem("barricas", JSON.stringify(this.barricas));
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
