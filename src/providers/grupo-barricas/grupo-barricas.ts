import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { URL_SERVICIOS } from '../../config/url.services';
import { Grupo } from '../../interfaces/grupo.interface';
import { AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Barrica, GrupoBarrica } from '../../class';
import { AjustesService } from '../';

@Injectable()
export class GrupoBarricasProvider {

  pagina: number = 0;
  size: number = 20;
  grupos: Grupo[] = [];
  gruposB: Grupo[] = [];
  barricas: Barrica[] = [];
  codigosBarricas: number[] = [];
  depositos: any[] = [];
  grupo: any;

  constructor( private http: Http,
               private alertCtrl: AlertController,
               private platform: Platform,
               private storage: Storage,
               private _ajustesService: AjustesService) {
  }

  getAllGruposBarricasRedline() {
    let promesa = new Promise((resolve, reject) => {
      this.grupos = [];
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/getAllGruposBarricas`;
      this.http.get(url)
        .map(resp => resp.json())
        .subscribe(data => {
          if (data.error) {
              this.showAlert('Grupos Barricas', 'Ha ocurrido un error.')
          } else {
            this.grupos.push(...data);
            this.setAllGruposBarricasStorage();
            console.log(this.grupos);
            resolve();
          }
        })

    })
    return promesa;
  }

  getAllGruposBarricasStorage() {
    let promesa = new Promise((resolve, reject)=>{
      if (this.platform.is("cordova")) {
        //Dispositivo
        this.storage.get("grupos")
          .then((grupos) => {
              if(grupos){
                this.grupos = grupos;
              }
              resolve();
          });
      } else {
        //Escritorio
        if (localStorage.getItem("grupos")) {
          this.grupos = JSON.parse(localStorage.getItem("grupos"));
        }
        resolve();
      }
    });

    return promesa;
  }

  getBarricasRedline(codigo: number) {
    this.barricas = [];
    this.codigosBarricas = [];
    let promesa = new Promise((resolve, reject) => {
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/getGruposBarrica?codigo=${codigo}`;
      console.log(url);
      this.http.get(url)
        .map(resp => resp.json())
        .subscribe(data => {
          console.log(data);
          if (data.error) {
            //Aqui hay un problema
          } else {
            this.barricas.push(...data);
            for (let barrica of this.barricas) {
              this.codigosBarricas.push(barrica.codigoBarrica);
            }
          }
        })
      resolve();
    })
    return promesa;
  }

  getBarricasStorage(grupo: any){
    this.barricas = [];
    this.codigosBarricas = [];
    let promesa = new Promise((resolve, reject)=>{
      if (this.platform.is("cordova")) {
        this.storage.ready()
          .then(() => {
            this.storage.get("barricas")
              .then((barricas) => {
                  if(barricas){
                    let todasBarricas:any[] = [];
                    todasBarricas = barricas;
                      for( let barrica of grupo.barricas ){
                        console.log(barrica);
                        for (let i=0; i < todasBarricas.length; i++){
                         if (todasBarricas[i]['codigoBarrica'] === parseInt(barrica)){
                           this.barricas.push(todasBarricas[i]);
                         }
                        }
                      }
                      for (let barrica of this.barricas) {
                        this.codigosBarricas.push(barrica.codigoBarrica);
                      }
                  }
              });
          })
        }else{
          if (localStorage.getItem("barricas")) {
            let todasBarricas:any[] = [];
            todasBarricas = JSON.parse(localStorage.getItem('barricas'));
              for( let barrica of grupo.barricas ){
                console.log(barrica);
                for (let i=0; i < todasBarricas.length; i++){
                  if (todasBarricas[i]['codigoBarrica'] === parseInt(barrica)){
                    this.barricas.push(todasBarricas[i]);
                  }
                }
              }
              for (let barrica of this.barricas) {
                this.codigosBarricas.push(barrica.codigoBarrica);
              }
          }
        }
    })
  }

  removeBarricaFromGrupoRedline(codigoGrupoBarrica: number, codigoBarrica: number) {
    let promesa = new Promise((resolve, reject) => {
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/removeBarricaFromGrupo?codigoGrupoBarrica=${codigoGrupoBarrica}&codigoBarrica=${codigoBarrica}`;
      this.http.delete(url)
        .map(resp => resp.json())
        .subscribe(data => {
          if (data.error) {

          } else {
            this.getBarricasRedline(codigoGrupoBarrica);
          }

        })
      resolve();
    })
    return promesa;
  }

  removeBarricaFromGrupoStorage(codigoGrupoBarrica: number, codigoBarrica: number){

    let barrica = {
      codigoGrupoBarrica: codigoGrupoBarrica,
      codigoBarrica: codigoBarrica
    }
    let rBarricas:any[] = [];
    if (this.platform.is("cordova")) {
      //Dispositivo
      this.storage.ready()
        .then(() => {
          this.storage.get("rbarrica")
            .then((rbarrica) => {
                if(rbarrica){
                  rBarricas = rbarrica;
                }
                rBarricas.push(barrica);
                this.storage.set('rbarrica', rBarricas);
            });
        })
    } else {
      //Escritorio
      if (localStorage.getItem("rbarrica")) {
        rBarricas = JSON.parse(localStorage.getItem("rbarrica"));
      }
      rBarricas.push(barrica);
      localStorage.setItem('rbarrica', JSON.stringify(rBarricas));
    }
  }

  addBarricaToGrupoRedline(grupo: any) {
    let promesa = new Promise((resolve, reject) => {
      console.log(grupo);
      let body = JSON.stringify(grupo);
      let headers = new Headers({
        'Content-Type': 'application/json'
      })
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/addBarricaToGrupo`;

      this.http.put(url, body, { headers })
        .map(resp => resp.json())
        .subscribe(data => {
          if (data.error) {

          } else {
            this.getBarricasRedline(grupo.codigoGrupoBarrica);
          }

        })
      resolve();
    })
    return promesa;
  }

  addBarricaToGrupoStorage(grupo: any) {
    let addBarricas:any[] = [];
    if (this.platform.is("cordova")) {
      //Dispositivo
      this.storage.ready()
        .then(() => {
          this.storage.get("addBarrica")
            .then((addBarrica) => {
                if(addBarrica){
                  addBarricas = addBarrica;
                }
                addBarricas.push(grupo);
                this.storage.set('addBarrica', addBarricas);
            });
        })
    } else {
      //Escritorio
      if (localStorage.getItem("addBarrica")) {
        addBarricas = JSON.parse(localStorage.getItem("addBarrica"));
      }
      addBarricas.push(grupo);
      localStorage.setItem('addBarrica', JSON.stringify(addBarricas));
    }
    this.getBarricasStorage(grupo);

  }

  saveGrupoBarricaRedline(grupo: any) {
    let promesa = new Promise((resolve, reject) => {
      console.log(grupo);
      let body = JSON.stringify(grupo);
      let headers = new Headers({
        'Content-Type': 'application/json'
      })
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/saveGrupoBarrica`;

      this.http.post(url, body, { headers })
        .map(resp => resp.json())
        .subscribe(data => {
          if (data.error) {
            reject();
          } else {
            console.log(data);
            resolve();
          }
        })

    })
    return promesa;
  }

  saveGrupoBarricaStorage(grupo: any) {
    let addGrupos:any[] = [];
    if (this.platform.is("cordova")) {
      //Dispositivo
      this.storage.ready()
        .then(() => {
          this.storage.get("addGrupo")
            .then((addGrupo) => {
                if(addGrupo){
                  addGrupos = addGrupo;
                }
                addGrupos.push(grupo);
                this.storage.set('addGrupo', addGrupos);
            });
        })
    } else {
      //Escritorio
      if (localStorage.getItem("addGrupo")) {
        addGrupos = JSON.parse(localStorage.getItem("addGrupo"));
      }
      addGrupos.push(grupo);
      localStorage.setItem('addGrupo', JSON.stringify(addGrupos));
    }
  }

  getAllDepositosAsociadosRedline() {
    let promesa = new Promise((resolve, reject) => {
      this.depositos = [];
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/getAllDepositosAsociados`;
      this.http.get(url)
        .map(resp => resp.json())
        .subscribe(data => {
          if (data.error) {
            //Aqui hay un problema
          } else {
            this.depositos.push(...data);
            this.setAllDepositosAsociadosStorage();
            resolve();
          }

        })
    })
    return promesa;

  }

  getAllDepositosAsociadosStorage(){
    let promesa = new Promise((resolve, reject) => {
      this.depositos = [];
      if (this.platform.is("cordova")) {
        //Dispositivo
        this.storage.get("depositos")
          .then((depositos) => {
              if(depositos){
                this.depositos = depositos;
              }
              resolve();
          });
      } else {
        //Escritorio
        if (localStorage.getItem("depositos")) {
          this.depositos = JSON.parse(localStorage.getItem("depositos"));
        }
        resolve();
      }
    })
    return promesa;
  }

  getGrupoBarricaFromBarricaRedline(codigo: string) {
    let promesa = new Promise((resolve, reject) => {
      this.grupo = [];
      const IP = `http://${this._ajustesService.ajustes.ip}:${this._ajustesService.ajustes.puerto}`;
      let url = `${IP}${URL_SERVICIOS}/barricas/getGrupoBarricaFromBarrica?codigo=${codigo}`;
      this.http.get(url)
        .map(resp => resp.json())
        .subscribe(data => {
          if (data.error) {
            //Aqui hay un problema
          } else {
            this.grupo = data;
            resolve();
          }
        })
    })
    return promesa;
  }

  getGrupoBarricaFromBarricaStorage(codigo: string) {
    let promesa = new Promise((resolve,reject)=>{
      if (localStorage.getItem("grupos")) {
        let grupos:GrupoBarrica[] = [];
        grupos = JSON.parse(localStorage.getItem('grupos'));
          for( let grupo of grupos ){
            for (let i=0; i < grupo.barricas.length; i++){
              if (grupo.barricas[i] === parseInt(codigo)){
                this.grupo = grupo;
                console.log(grupo);
                resolve();
              }
            }
          }
      }
    })

    return promesa;

  }

  showAlert( titulo:string, mensaje:string ) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['OK']
    });
    alert.present();
  }

  setAllGruposBarricasStorage() {
    if (this.platform.is("cordova")) {
      //Dispositivo
      this.storage.ready()
        .then(() => {
          this.storage.set('grupos', this.grupos);
        })
    } else {
      //Escritorio
      localStorage.setItem("grupos", JSON.stringify(this.grupos));
    }
  }

  setAllDepositosAsociadosStorage(){
    if (this.platform.is("cordova")) {
      //Dispositivo
      this.storage.ready()
        .then(() => {
          this.storage.set('depositos', this.depositos);
        })
    } else {
      //Escritorio
      localStorage.setItem("depositos", JSON.stringify(this.depositos));
    }
  }

}
