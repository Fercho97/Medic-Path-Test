import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../../usuario/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-info-medic',
  templateUrl: './info-medic.component.html',
  styleUrls: ['./info-medic.component.css'],
  providers: [UsuarioService]
})
export class InfoMedicComponent implements OnInit {

  @Input() public hash_doctor; 
  public infoDoc : any = {} as any;
  public especializaciones : any[] = [];
  public url : string = "";
  public  hasInfo : boolean = false;
  public nombreCompleto = "";
  constructor(public activeModal: NgbActiveModal, private userServ : UsuarioService, 
              public spinner : NgxSpinnerService) { 

  }

  ngOnInit() {
    this.spinner.show();
    this.userServ.getDoctorInfo(this.hash_doctor).subscribe( (res : any) =>{
      //console.log(res.body);

      this.infoDoc = res.body.usuario;
      this.nombreCompleto = res.body.usuario.nombres + " " + res.body.usuario.apellidos;
      this.especializaciones = res.body.usuario.especializacions;

      if(res.body.usuario.imagen_perfil==null){
        this.url = "/assets/default-image.jpg"
      }else{
        this.hasInfo = true;
        this.url = res.body.usuario.imagen_perfil.toString();
      }
      this.spinner.hide();
    }, error =>{
      this.spinner.hide();
    });
  }
}
