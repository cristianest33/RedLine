import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { DetalleGrupoPage, NuevoGrupoPage, TabsPage } from '../';
import { GrupoBarricasProvider, AjustesService } from '../../providers/';
import { Grupo } from '../../interfaces/grupo.interface';

@IonicPage()
@Component({
  selector: 'page-grupos',
  templateUrl: 'grupos.html',
})
export class GruposPage {

  searchQuery: string = '';
  pagina:number = 0;
  gruposBarricas:Grupo[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _grupoBarricasProvider:GrupoBarricasProvider,
              private app: App,
              private _ajustesService: AjustesService ) {

      if(_ajustesService.network){
        this._grupoBarricasProvider.getAllGruposBarricasRedline()
            .then(()=>{
              this.gruposBarricas = this._grupoBarricasProvider.grupos;
            })
      }else{
        this._grupoBarricasProvider.getAllGruposBarricasStorage()
            .then(()=>{
              this.gruposBarricas = this._grupoBarricasProvider.grupos;
            })
      }

  }

  volver(){
    this.app.getRootNav().setRoot(TabsPage);
  }

  getGrupos(ev: any) {
    // Reset items back to all of the items
    this.gruposBarricas = this._grupoBarricasProvider.grupos;
    // set val to the value of the searchbar
    let val = ev.target.value;

    if (val && val.trim() != '') {

      this.buscar(val);
    }

  }

  buscar(termino:string){

    let descripcionGrupos: any[] = [];

    termino = termino.toLowerCase();

    for( let grupo of this.gruposBarricas ){
      let nombre = grupo.descripcionGrupoBarrica.toLowerCase();
      if( nombre.indexOf( termino ) >= 0 ){
        descripcionGrupos.push( grupo );
      }
    }
    this.gruposBarricas = descripcionGrupos;

  }

  verGrupo( grupo: any ){
    if (this._ajustesService.network){
      this._grupoBarricasProvider.getBarricasRedline(grupo.codigoGrupoBarrica);
    }else{
      this._grupoBarricasProvider.getBarricasStorage(grupo);
    }

    this.navCtrl.push(DetalleGrupoPage, { 'grupo': grupo });
  }

  nuevo_grupo(){
    this.navCtrl.push(NuevoGrupoPage);
  }


}
