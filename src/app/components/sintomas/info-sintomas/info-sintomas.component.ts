import { Component, OnInit, Input} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { SintomasService } from '../sintomas.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-info-sintomas',
  templateUrl: './info-sintomas.component.html',
  styleUrls: ['./info-sintomas.component.css'],
  providers: [SintomasService]
})
export class InfoSintomasComponent implements OnInit {

  public nivelesUrgencia :any = []
  @Input() public sintoma; 
  public compuesto = '';
  public urgency_value = 0;
  public pregunta : any = '';
  private values : HttpParams;
  public especialidades : any = [];
  public numeric = false;
  constructor(public activeModal: NgbActiveModal, private sintServ : SintomasService,
              private spinner : NgxSpinnerService, private toast: ToastrService) { 
   
  }

  ngOnInit() {
    this.urgency_value = this.sintoma.nivel_urgencia;

    this.sintServ.getNiveles().subscribe((res:any) =>{
      this.nivelesUrgencia = res.body.resultado;
      //console.log(this.compuestos);
      this.nivelesUrgencia.forEach(nivel => {
      
        if(nivel.valor===this.sintoma.nivel_urgencia){
          this.sintoma.nivel_urgencia = nivel.nombre;
        }
      });
    }, error =>{
      this.toast.error('Hubo un error al conseguir la información del catálogo de niveles de urgencia, favor de recargar la página', 'Error');
    });
    this.spinner.show();
    if(this.sintoma.question!=null){
      this.pregunta = JSON.parse(this.sintoma.question);
      if(this.pregunta.type=='numeric'){
        this.numeric=true;
      }
    }
    this.especialidades = JSON.parse(this.sintoma.porcentages);
    //console.log(this.especialidades);
    this.compuesto = this.sintoma.compuesto;
    if(this.sintoma.compuesto == true){

      this.values = new HttpParams()
      .set('composicion', this.sintoma.composicion);
      //console.log(this.values);

      this.sintServ.getNames(this.values).subscribe( (res: any) =>{
        //console.log(res.body);
        for(let item of res.body){
          this.sintoma.composicion = this.sintoma.composicion.replace(item.idSint,item.nombre_sint);
        }
      },
    error =>{
      this.toast.error('Error al conseguir los nombres de los componentes', 'Error');
      this.activeModal.close();
        //console.log(error);
    })

    this.sintoma.composicion = this.sintoma.composicion.replace(/,/g,' ');
    this.sintoma.composicion = this.sintoma.composicion.replace(/&/g,'Y');
    }
    
    this.spinner.hide();
  }

}
