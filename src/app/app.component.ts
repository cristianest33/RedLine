import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { AjustesService, UsuariosService, SincronizacionService } from '../providers'
import { GruposPage, BarricasPage, TabsPage, OrdenTrabajoPage, SlidesPage, LoginPage } from '../pages';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: any}>;

  constructor( private platform: Platform,
               statusBar: StatusBar,
               splashScreen: SplashScreen,
               private menuCrtl: MenuController,
               private _ajustesService: AjustesService,
               private network: Network,
               private _usuariosService: UsuariosService,
               private _sincronizacionService: SincronizacionService,
               private loadingCtrl: LoadingController ) {

    this.pages = [
        { title: 'INICIO', component: TabsPage },
        { title: 'ADMINISTRACION DE GRUPOS', component: GruposPage },
        { title: 'LEER QR', component: BarricasPage },
        { title: 'ORDENES DE TRABAJO', component: OrdenTrabajoPage }

    ];

    platform.ready().then(() => {

      this._ajustesService.cargar_storage().then( ()=>{
        if( this._ajustesService.ajustes.mostrar_tutorial){
          this.rootPage = SlidesPage;
        }else{
          this._usuariosService.cargarStorage().then( ()=>{
            if( this._usuariosService.usuario.recuerdame ){
              this.rootPage = TabsPage;
            }else {
              this.rootPage = LoginPage;
            }
          })
        }
        if(this.network.type === 'none'){
          this._ajustesService.network = false;
        }else{
          this._ajustesService.network = true;
        }
        let connectSubscription = this.network.onConnect().subscribe(() => {
          this._ajustesService.network = !this._ajustesService.network;
          console.log("Conectado: " + this._ajustesService.network);
          if (this._ajustesService.network){
            console.log('Sincronizando');
            let loader = this.loadingCtrl.create({
              content: "Sincronizando..."
            });
            loader.present();
            this._sincronizacionService.sincronizar()
                .then(()=>{
                  loader.dismiss();
                })
          }
        });

        let loader = this.loadingCtrl.create({
          content: "Sincronizando..."
        });
        loader.present();

        this._sincronizacionService.sincronizarTodo().then(()=>{
          this._sincronizacionService.sincronizar()
              .then(()=>{
                loader.dismiss();
              })
        });
        statusBar.styleDefault();
        splashScreen.hide();

      })
    });
  }

  openPage( pagina:any ){
    this.nav.setRoot(pagina.component);
    this.menuCrtl.close();
  }


}
