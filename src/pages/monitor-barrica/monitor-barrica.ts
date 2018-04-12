import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarricaProvider } from '../../providers';
import { Movimiento } from '../../class';

@IonicPage()
@Component({
  selector: 'page-monitor-barrica',
  templateUrl: 'monitor-barrica.html',
})
export class MonitorBarricaPage {

  movimiento: Movimiento = new Movimiento();
  codigo:string;
  porcentaje: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _barricaService: BarricaProvider ) {

    this.codigo = this.navParams.get('codigo');
    this._barricaService.getMovimientoVasija( this.codigo )
                        .then ( () => {
      this.cargar_movimiento();
      this.calcular_llenado();
    })
  }


  cargar_movimiento(){
    let movimiento: any = this._barricaService.movimiento;
    this.movimiento.calidad = movimiento.calidad;
    this.movimiento.codigoArticulo = movimiento.codigoArticulo;
    this.movimiento.codigoCorte = movimiento.codigoCorte;
    this.movimiento.codigoGrupoBarrica = movimiento.codigoGrupoBarrica;
    this.movimiento.codigoLote = movimiento.codigoLote;
    this.movimiento.codigoVasija = movimiento.codigoVasija;
    this.movimiento.color = movimiento.color
    this.movimiento.cosecha = movimiento.cosecha
    this.movimiento.depositoAsociado = movimiento.depositoAsociado;
    this.movimiento.descripcionArticulo = movimiento.descripcionArticulo
    this.movimiento.descripcionCorte = movimiento.descripcionCorte;
    this.movimiento.descripcionCosecha = movimiento.descripcionCosecha;
    this.movimiento.descripcionDepositoAsociado = movimiento.descripcionDepositoAsociado;
    this.movimiento.descripcionGrupoBarrica = movimiento.descripcionGrupoBarrica;
    this.movimiento.descripcionLote = movimiento.descripcionLote;
    this.movimiento.descripcionVasija = movimiento.descripcionVasija;
    this.movimiento.fechaLlenado = movimiento.fechaLlenado;
    this.movimiento.capacidad = movimiento.capacidad;
    this.movimiento.restoVasija = movimiento.restoVasija;
    this.movimiento.saldo =movimiento.saldo;
    this.movimiento.tipoCorte = movimiento.tipoCorte;
    this.movimiento.variedad = movimiento.variedad;
  }

  calcular_llenado() {
    this.porcentaje = (this.movimiento.saldo * 100) / this.movimiento.capacidad;
  }

  volver(){
    this.navCtrl.pop();
  }

}
