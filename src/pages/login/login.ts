import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController } from 'ionic-angular';
import { TabsPage } from '../';
import { UsuariosService } from '../../providers';
import { Usuario } from '../../class';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  usuario = new Usuario('','','Administrador','Puede hacer todo menos el parte diario');
  recuerdame:boolean = false;

  constructor( public navCtrl: NavController,
               public navParams: NavParams,
               private menuCtrl: MenuController,
               private toastCtrl: ToastController,
               private _usuarioService: UsuariosService ) {

      this.menuCtrl.enable(false);
  }

  login(){
    if (this.usuario.nombreUsuario === 'redline' && this.usuario.password === 'redline'){
        if( this.recuerdame ){
          this._usuarioService.usuario.nombreUsuario = this.usuario.nombreUsuario;
          this._usuarioService.usuario.password = this.usuario.password;
          this._usuarioService.usuario.recuerdame = this.recuerdame;
          this._usuarioService.usuario.rol[0].nombreRol = this.usuario.rol[0].nombreRol;
          this._usuarioService.guardar_storage();
        } else {
          this._usuarioService.usuario.rol[0].nombreRol = this.usuario.rol[0].nombreRol;
          this._usuarioService.guardar_storage();
        }
        this.navCtrl.push(TabsPage);


    }else{
      this.mostrarError('Usuario o clave incorrecta');
    }

  }

  mostrarError(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();

  }

}
