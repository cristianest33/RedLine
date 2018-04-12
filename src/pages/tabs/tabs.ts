import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { HomePage, PreferenciasPage, MasPage } from '../';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1:any = HomePage;
  tab2:any = PreferenciasPage;
  tab3:any = MasPage;

  constructor() {
  }

}
