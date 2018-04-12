import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AjustesService, GrupoBarricasProvider, BarricaProvider, OrdenesTrabajoProvider } from '../';
import { AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class SincronizacionService {

  constructor( private http: Http,
               private _ajustesService: AjustesService,
               private alertCtrl: AlertController,
               private _grupoBarricasService: GrupoBarricasProvider,
               private platform: Platform,
               private storage: Storage,
               private _barricaService: BarricaProvider,
               private _ordenesTrabajoProvider: OrdenesTrabajoProvider ) {

    console.log('Hello SincronizacionProvider Provider');
  }

  sincronizarTodo(){
    let promesa = new Promise( (resolve, reject)=>{
      if(this._ajustesService.network){
        //Sincronizar
        this.sincronizaGrupos();
        this.sincronizaBarricas();
        this.sincronizaDeposito();
        this.sincronizaOrdenesTrabajo();
        this.sincronizar();
        resolve();
      } else {
        this.showAlert();
        reject();
      }
    })

    return promesa;

  }

  sincronizar(){
    let promesa = new Promise( (resolve, reject)=>{
      this.sincronizaOperaciones();
      resolve();
    })
    return promesa;

  }

  sincronizaGrupos(){
    this._grupoBarricasService.getAllGruposBarricasRedline();
  }

  sincronizaBarricas(){
    this._barricaService.getAllBarricasRedline();
  }

  sincronizaDeposito(){
    this._grupoBarricasService.getAllDepositosAsociadosRedline();
  }

  sincronizaOrdenesTrabajo(){
    this._ordenesTrabajoProvider.getAllOrdenesTrabajoRedline();
  }

  sincronizaOperaciones(){
    this.sincronizaRemoveGrupo();
    this.sincronizaAddBarrica();
    this.sincronizaSaveGrupo();
    this.sincronizaConfirmarOperaciones();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Sincronización',
      subTitle: 'La aplicación no puede sincronizar. No posee conexión a Internet. ',
      buttons: ['OK']
    });
    alert.present();
  }

  sincronizaRemoveGrupo(){
    let rBarricas:any[] = [];
    let promesa = new Promise((resolve, reject)=>{
      if (this.platform.is("cordova")) {
        //Dispositivo
        this.storage.get("rbarrica")
          .then((rbarricas) => {
              if(rbarricas){
                rBarricas = rBarricas;
              }
              for( let rBarrica of rBarricas){
                this._grupoBarricasService.removeBarricaFromGrupoRedline(rBarrica.codigoGrupoBarrica, rBarrica.codigoBarrica);
              }
              this.storage.remove('rbarrica');
              resolve();
          });
      } else {
        //Escritorio
        if (localStorage.getItem("rbarrica")) {
          rBarricas = JSON.parse(localStorage.getItem("rbarrica"));
          for( let rBarrica of rBarricas){
            this._grupoBarricasService.removeBarricaFromGrupoRedline(rBarrica.codigoGrupoBarrica, rBarrica.codigoBarrica);
          }
          localStorage.removeItem('rbarrica');
        }
        resolve();
        }
      });

      return promesa;

  }

  sincronizaAddBarrica(){
    let addBarricas:any[] = [];
    let promesa = new Promise((resolve, reject)=>{
      if (this.platform.is("cordova")) {
        //Dispositivo
        this.storage.get("addBarrica")
          .then((addBarrica) => {
              if(addBarrica){
                addBarricas = addBarrica;
              }
              for( let addBarrica of addBarricas){
                this._grupoBarricasService.addBarricaToGrupoRedline(addBarrica);
              }
              this.storage.remove('addBarrica');
              resolve();
          });
      } else {
        //Escritorio
        if (localStorage.getItem("addBarrica")) {
          addBarricas = JSON.parse(localStorage.getItem("addBarrica"));
          for( let addBarrica of addBarricas){
            this._grupoBarricasService.addBarricaToGrupoRedline(addBarrica);
          }
          localStorage.removeItem('addBarrica');
        }
        resolve();
        }
      });

      return promesa;
  }

  sincronizaSaveGrupo(){
    let addGrupos:any[] = [];
    let promesa = new Promise((resolve, reject)=>{
      if (this.platform.is("cordova")) {
        //Dispositivo
        this.storage.get("addGrupo")
          .then((addGrupo) => {
              if(addGrupo){
                addGrupos = addGrupo;
              }
              for( let addGrupo of addGrupos){
                this._grupoBarricasService.saveGrupoBarricaRedline(addGrupo);
              }
              this.storage.remove('addGrupo');
              resolve();
          });
      } else {
        //Escritorio
        if (localStorage.getItem("addGrupo")) {
          addGrupos = JSON.parse(localStorage.getItem("addGrupo"));
          for( let addGrupo of addGrupos){
            this._grupoBarricasService.saveGrupoBarricaRedline(addGrupo);
          }
          localStorage.removeItem('addGrupo');
        }
        resolve();
        }
      });

      return promesa;
  }

  sincronizaConfirmarOperaciones(){
    let cOperaciones: any[] = []
    let promesa = new Promise((resolve, reject)=>{
      if (this.platform.is("cordova")) {
        //Dispositivo
        this.storage.get("cOperacion")
          .then((cOperacion) => {
              if(cOperacion){
                cOperaciones = cOperacion;
              }
              for( let cOperacion of cOperaciones){
                this._ordenesTrabajoProvider.confirmaOperacionRedline(cOperacion.idMovimiento, cOperacion.idDetalle, cOperacion.merma, cOperacion.borra);
              }
              this.storage.remove('cOperacion');
              resolve();
          });
      } else {
        //Escritorio
        if (localStorage.getItem("cOperacion")) {
          cOperaciones = JSON.parse(localStorage.getItem("cOperacion"));
          for( let cOperacion of cOperaciones){
            this._ordenesTrabajoProvider.confirmaOperacionRedline(cOperacion.idMovimiento, cOperacion.idDetalle,cOperacion.merma, cOperacion.borra);
          }
          localStorage.removeItem('cOperacion');
        }
        resolve();
        }
      });

      return promesa;
  }

}
