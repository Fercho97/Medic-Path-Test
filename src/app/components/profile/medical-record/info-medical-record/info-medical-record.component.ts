import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileService } from '../../profile.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-info-medical-record',
  templateUrl: './info-medical-record.component.html',
  styleUrls: ['./info-medical-record.component.css'],
  providers: [ProfileService]
})
export class InfoMedicalRecordComponent implements OnInit {

  @Input() public historial;
  padecimientoInfo = {} as any;
  public url : string = '';
  public sintomas = [];
  public niveles : any = { "Ninguno" : [], "Bajo" : [], "Medio" : [], "Alto" : [], "Severo" : []};
  public recomendaciones : any = [];
  public seleccionado = "";
  public hasOneSelected = false;
  constructor(public activeModal: NgbActiveModal, private profileServ : ProfileService, private toast : ToastrService) { 

  }

  ngOnInit() {
    this.profileServ.getHistory(this.historial).subscribe( (res: any) =>{
       console.log(res.body);
      this.historial = res.body.resultado;
      this.sintomas = res.body.resultado.detalles.split(",");
      if(this.historial.detalles_especificos!=null){
        this.niveles= JSON.parse(this.historial.detalles_especificos);
      }
      if(this.historial.recomendaciones_especialista!=null){
        this.recomendaciones = JSON.parse(this.historial.recomendaciones_especialista);
      }

      if(this.historial.especialista_seleccionado!=null){
        this.seleccionado = this.historial.especialista_seleccionado;
        this.hasOneSelected=true;
      }
      
      sessionStorage.setItem('token', res.body.token);
      if(this.historial.url_imagen_pad!= null){
      this.url = this.historial.url_imagen_pad.toString();
      }
    },
  error =>{
      console.log(error);
  })
  }

  actualizar(){

    let values = new HttpParams()
      .set('seleccion', this.seleccionado)
    this.profileServ.actualizacionEspecialista(this.historial.hashId, values).subscribe( (res: any) =>{
      sessionStorage.setItem('token',res.body.token);
      this.toast.success('Se ha modificado el padecimiento con éxito!', 'Modificación Exitosa!');
      this.hasOneSelected=true;
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error.message, 'Error');
  }
    );
  }
}
