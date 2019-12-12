import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { PadecimientoService} from '../padecimientos.service';
import { Padecimiento } from '../../../interfaces/padecimiento.interface';
import { Sintoma } from '../../../interfaces/sintoma.interface';

@Component({
  selector: 'app-info-padecimientos',
  templateUrl: './info-padecimientos.component.html',
  styleUrls: ['./info-padecimientos.component.css'],
  providers: [PadecimientoService]
})
export class InfoPadecimientosComponent implements OnInit {

  @Input() public pad; 
  public compuesto = '';
  public values : HttpParams;
  public padecimiento : Padecimiento = {} as any;
  public sintomas : Sintoma[] = [];
  public sintomasCadena :  string = "";
  public url : string = "";
  public  hasInfo : boolean = false;
  constructor(public activeModal: NgbActiveModal, private padServ : PadecimientoService, ) { 

  }

  ngOnInit() {
    console.log(this.pad);
    this.padServ.getPad(this.pad).subscribe( (res : any) =>{
      console.log(res.body);
      this.padecimiento = res.body.padecimiento;
      this.sintomas = res.body.sintomas;
      
      this.sintomas.forEach(sintoma => {
        if(this.sintomasCadena==""){
          this.sintomasCadena += sintoma.nombre_sint;
        }
        else{
          this.sintomasCadena += " Y " + sintoma.nombre_sint;
        }
      });

      if(this.padecimiento.url_imagen_pad==null){
        this.url = "../../../../assets/default-image.jpg"
      }else{
        this.hasInfo = true;
        this.url = this.padecimiento.url_imagen_pad.toString();
      }
    });
  }

}
