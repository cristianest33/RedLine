import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Usuario } from '../../class/usuario';
import 'rxjs/add/operator/map';

@Injectable()
export class UsuariosService {

  usuario = new Usuario('','','','');

  constructor( private http: Http,
               private platform: Platform,
               private storage: Storage ) {

    console.log('Hello UsuarioProvider Provider');
  }

  cargarStorage(){

    let promesa = new Promise (( resolve, reject )=>{
      if( this.platform.is('cordova')){

        this.storage.ready()
            .then(()=>{
              this.storage.get('usuario')
                  .then((usuario) => {
                    if(usuario){
                      this.usuario  = usuario;
                    }
                    resolve();
              })
        })
      }else{
        //Escritorio
        if ( localStorage.getItem('usuario') ){
          this.usuario = JSON.parse(localStorage.getItem('usuario'));
        }
        resolve();
      }
    })
    return promesa;
  }

  guardar_storage(){
    if( this.platform.is('cordova')){
      //Dispositivo
      this.storage.ready()
          .then(()=>{
            this.storage.set('usuario', this.usuario);
      })

    }else{
      //Escritorio
      localStorage.setItem('usuario', JSON.stringify(this.usuario));
    }
  }

}
