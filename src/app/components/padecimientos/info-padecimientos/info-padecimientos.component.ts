import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { PadecimientoService} from '../padecimientos.service';
import { Padecimiento } from '../../../interfaces/padecimiento.interface';
import { Sintoma } from '../../../interfaces/sintoma.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  public hasInfo : boolean = false;
  public especialidad : any = "";
  constructor(public activeModal: NgbActiveModal, private padServ : PadecimientoService, 
              public spinner: NgxSpinnerService, private toast : ToastrService) { 

  }

  ngOnInit() {
    //console.log(this.pad);
    this.spinner.show();
    this.padServ.getPad(this.pad).subscribe( (res : any) =>{
      //console.log(res.body);
      this.padecimiento = res.body.padecimiento;
      this.sintomas = res.body.padecimiento.sintomas;
      
      if(this.padecimiento.especializacion!=null){
        this.especialidad= this.padecimiento.especializacion.nombre_esp;
      }
      this.sintomas.forEach(sintoma => {
        if(this.sintomasCadena==""){
          this.sintomasCadena += sintoma.nombre_sint;
        }
        else{
          this.sintomasCadena += " Y " + sintoma.nombre_sint;
        }
      });

      if(this.padecimiento.url_imagen_pad==null || this.padecimiento.url_imagen_pad==""){
        this.url = "/assets/default-image.jpg"
      }else{
        this.hasInfo = true;
        this.url = this.padecimiento.url_imagen_pad.toString();
      }
      this.spinner.hide();
    }, error =>{
      this.spinner.hide();
      this.toast.error('Error al conseguir la información del padecimiento', 'Error');
    });
  }

}
