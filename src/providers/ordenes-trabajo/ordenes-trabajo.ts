import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { URL_SERVICIOS } from '../../config/url.services';
import { Operacion, DetalleOperacion } from '../../class';
import { AjustesService } from '../';
import { AlertController, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class OrdenesTrabajoProvider {

  ordenes:any[] = [];
  detalleOrden:any[] = [];
  cant:number = 0;
  tareas:any[] = [];
  origenes:any[] = [];
  confirma:string;
  detalleOperacion: DetalleOperacion[] = [];

  constructor( private http: Http,
               private _ajustesService: AjustesService,
               private platform: Platform,
               private storage: Storage,
               private loadingCtrl: LoadingController ) {

    console.log('Hello OrdenesTrabajoProvider Provider');

  }

  getAllOrdenesTrabajoRedline(){
    this.ordenes = [];
    let promesa = new Promise( ( resolve, reject ) => {
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/operacionesEnologicas/getAllOperaciones`;
      this.http.get( url )
               .map( resp => resp.json() )
               .subscribe( data => {

                  if( data.error ){
                    //Aqui hay un problema
                  }else{
                    this.ordenes.push( ...data );
                    this.setAllOrdenesTrabajoStorage();
                    resolve();
                  }
                })

    })

    return promesa;
  }

  getAllOrdenesTrabajoStorage(){
    let promesa = new Promise((resolve, reject)=>{
      if (this.platform.is("cordova")) {
        //Dispositivo
        this.storage.get("ordenes")
          .then((ordenes) => {
              if(ordenes){
                this.ordenes = ordenes;
              }
              resolve();
          });
      } else {
        //Escritorio
        if (localStorage.getItem("ordenes")) {
          this.ordenes = JSON.parse(localStorage.getItem("ordenes"));
        }
        resolve();
      }
    });

    return promesa;
  }

  setAllOrdenesTrabajoStorage() {
    if (this.platform.is("cordova")) {
      //Dispositivo
      this.storage.ready()
        .then(() => {
          this.storage.set('ordenes', this.ordenes);
        })
    } else {
      //Escritorio
      localStorage.setItem("ordenes", JSON.stringify(this.ordenes));
    }
  }

  getDetalleOperacionStorage( orden:any ){
    this.detalleOrden = [];
    this.tareas = [];
    this.origenes = [];
    let det:number = 0;
    let promesa = new Promise((resolve,reject)=>{
      this.detalleOrden = orden.detalleOperacionOff;
      for (let op of this.detalleOrden ){
        if ( det != op.idDetalle ){
          if (det != 0){
            operacion.origen = this.origenes;
            this.tareas.push(operacion);
            this.origenes = [];
          }
          var operacion = new Operacion();
          det = op.idDetalle;
        }
        if (op.movimiento == "ORIGEN"){
          this.origenes.push(op);
        }else{
          operacion.destino = op;
        }
      }
      operacion.origen = this.origenes;
      this.tareas.push(operacion);
      console.log(this.tareas);
      resolve();
    })
    return promesa;
  }

  getDetalleOperacionBarricaRedline( id: number ) {
    this.detalleOperacion = [];
    let promesa = new Promise( ( resolve, reject ) => {
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/operacionesEnologicas/getDetalleOperacionBarrica?idMovimiento=${id}`;
      this.http.get( url )
               .map( resp => resp.json() )
               .subscribe( data => {

                  if( data.error ){
                    //Aqui hay un problema
                  }else{
                    this.detalleOperacion.push( ...data );
                    resolve();
                  }
                })

    })

    return promesa;
  }

  getDetalleOperacionBarricaStorage( tarea: any ) {
    this.detalleOperacion = [];
    let promesa = new Promise((resolve,reject)=>{
      this.detalleOperacion = tarea.detalleGrupo;
      resolve();
    })

    return promesa;
  }

  confirmaOperacionRedline(idMovimiento:number, idDetalle:number, merma:number, borra:number){
    let promesa = new Promise( ( resolve, reject ) => {
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/operacionesEnologicas/confirmaOperacion?idMovimiento=${idMovimiento}&idDetalle=${idDetalle}&&pLtsMerma=${merma}&pLtsBorra=${borra}`;
    this.http.get( url )
             //.map( resp => resp.json() )
             .subscribe( data => {
                this.confirma = data.text();
                this.getAllOrdenesTrabajoRedline().then(()=>{
                  resolve();
                })

              })

    })

    return promesa;
  }

  confirmaOperacionStorage(idMovimiento:number, idDetalle:number, merma:number, borra:number){
    let operacion = {
      idMovimiento: idMovimiento,
      idDetalle: idDetalle,
      merma: merma,
      borra: borra
    }
    let cOperaciones:any[] = [];
    if (this.platform.is("cordova")) {
      //Dispositivo
      this.storage.ready()
        .then(() => {
          this.storage.get("cOperacion")
            .then((cOperacion) => {
                if(cOperacion){
                  cOperaciones = cOperacion;
                }
                cOperaciones.push(operacion);
                this.storage.set('cOperacion', cOperaciones);
            });
        })
    } else {
      //Escritorio
      if (localStorage.getItem("cOperacion")) {
        cOperaciones = JSON.parse(localStorage.getItem("cOperacion"));
      }
      cOperaciones.push(operacion);
      localStorage.setItem('cOperacion', JSON.stringify(cOperaciones));
    }
  }
}
