import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TabsPage} from '../';
import { AjustesService, UsuariosService, SincronizacionService} from '../../providers';

@IonicPage()
@Component({
  selector: 'page-preferencias',
  templateUrl: 'preferencias.html',
})
export class PreferenciasPage {

  //ip:string;

  configuracion = {
    ip: null,
    puerto: null,
    recuerdame: true,
    tutorial: true,
    usuario: null,
  }

  constructor( public navCtrl: NavController,
               public navParams: NavParams,
               private alertCtrl: AlertController,
               private _ajustesService: AjustesService,
               private _usuariosService: UsuariosService,
               private loadingCtrl: LoadingController,
               private _sincronizacionService: SincronizacionService ) {

    this.configuracion.recuerdame = this._usuariosService.usuario.recuerdame;
    this.configuracion.tutorial = this._ajustesService.ajustes.mostrar_tutorial;
    this.configuracion.usuario = this._usuariosService.usuario.nombreUsuario;
    if(this._ajustesService.ajustes.ip !== '181.118.92.162') {
      this.configuracion.ip = this._ajustesService.ajustes.ip;
      this.configuracion.puerto = this._ajustesService.ajustes.puerto;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreferenciasPage');
  }

  mostrarAlerta(titulo: string, mensaje: string){
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  cambiarTutorial(){
    this.configuracion.tutorial = !this.configuracion.tutorial;
  }

  cambiarRecuerdame(){
    this.configuracion.recuerdame = !this.configuracion.recuerdame;
  }

  guardar(forma: any) {
    console.log("Formulario posteado");
    console.log(forma.form.controls.ip.errors);
    if(!this.configuracion.ip){
      this._ajustesService.ajustes.ip = '181.118.92.162';
      this._ajustesService.ajustes.puerto = '8090';
    }else{
      if(forma.form.controls.ip.errors){
        this.mostrarAlerta('Dirección IP', 'La dirección IP especificada no es correcta');
      } else {
        if(!this.configuracion.puerto){
          this.mostrarAlerta('Puerto', 'Debe ingresar un puerto para conectarse');
        }else{
        this._ajustesService.ajustes.ip = this.configuracion.ip;
        this._ajustesService.ajustes.puerto = this.configuracion.puerto;
        }
      }

    }
    this._ajustesService.ajustes.mostrar_tutorial = this.configuracion.tutorial;
    this._usuariosService.usuario.recuerdame = this.configuracion.recuerdame;
    this._ajustesService.guardar_storage();
    this._usuariosService.guardar_storage();
    if (this._ajustesService.network){
      console.log('Sincronizando');
      let loader = this.loadingCtrl.create({
        content: "Sincronizando..."
      });
      loader.present();
      this._sincronizacionService.sincronizarTodo()
          .then(()=>{
            loader.dismiss();
          })
    }
  }

  aceptar() {
    this.navCtrl.push(TabsPage);
  }


}
