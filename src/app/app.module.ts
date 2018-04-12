import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, ModalController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//Http
import { HttpModule } from '@angular/http';

// Services
import { BarricaProvider, UsuariosService, AjustesService, GrupoBarricasProvider,
         OrdenesTrabajoProvider, SincronizacionService } from '../providers';

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';

// Pages
import { MyApp } from './app.component';
import { HomePage, LoginPage, TabsPage, MasPage, PreferenciasPage, GruposPage, BarricasPage,
         DetalleGrupoPage, NuevoGrupoPage, OperacionesPage, OrdenTrabajoPage,
         SlidesPage, MonitorBarricaPage, GrupoOperacionPage } from '../pages';
        

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    MasPage,
    PreferenciasPage,
    GruposPage,
    BarricasPage,
    DetalleGrupoPage,
    NuevoGrupoPage,
    OperacionesPage,
    OrdenTrabajoPage,
    SlidesPage,
    MonitorBarricaPage,
    GrupoOperacionPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    MasPage,
    PreferenciasPage,
    GruposPage,
    BarricasPage,
    DetalleGrupoPage,
    NuevoGrupoPage,
    OperacionesPage,
    OrdenTrabajoPage,
    SlidesPage,
    MonitorBarricaPage,
    GrupoOperacionPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    Network,
    BarricaProvider,
    UsuariosService,
    GrupoBarricasProvider,
    OrdenesTrabajoProvider,
    AjustesService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SincronizacionService,
  ]
})
export class AppModule {}
