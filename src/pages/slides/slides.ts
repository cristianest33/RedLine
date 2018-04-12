import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LoginPage, TabsPage } from '../index';
import { AjustesService, UsuariosService } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                private menuCrtl: MenuController,
                private _ajustesService: AjustesService,
                private _usuariosService: UsuariosService ) {

    this.menuCrtl.enable(false);
  }

  skip() {
    this._ajustesService.ajustes.mostrar_tutorial = false;
    this._ajustesService.guardar_storage();
    this._usuariosService.cargarStorage().then( ()=>{
      if( this._usuariosService.usuario.recuerdame ){
        this.navCtrl.push(TabsPage);
      }else {
        this.navCtrl.push(LoginPage);
      }
    })
    this.navCtrl.push(LoginPage);

  }

  slides = [
    {
      title: "Bienvenido a Redline Enología Móvil",
      image: "assets/images/logo-blanco.png",
    },
    {
      title: "¿Qué podemos hacer?",
      description: "Con <b>Enología Móvil</b> vas a poder administrar las labores agrícolas desde el campo, a través de las registración de tareas y realización del parte diario",

    },
  ];

}
