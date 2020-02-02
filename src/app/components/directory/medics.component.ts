import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoMedicComponent } from './info-medic/info-medic.component';
import {Router, ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-medics',
  templateUrl: './medics.component.html',
  styleUrls: ['./medics.component.css'],
  providers: [UsuarioService]
})
export class MedicsComponent implements OnInit {

  medicos : any[] = [];
  pagina = 0;
  public historiales : any[] = [];
  key :string = 'padecimiento_final';
  reversa : boolean = false;
  myFilter;
  tipo = "all";
  hasEspe = false;
  constructor(private userServ : UsuarioService, private modalService : NgbModal, private route : ActivatedRoute) { }

  ngOnInit() {
    if(this.route.snapshot.params.type){
      this.tipo = this.route.snapshot.params.type
      this.hasEspe = true;
    }
    console.log(this.tipo);
    this.userServ.getDoctors(this.tipo).subscribe((res: any) =>{

      this.medicos = res.body;

    });
  }

  openModal(info, hash : any){
    const modalRef = this.modalService.open(InfoMedicComponent, { windowClass : "myCustomModalClass"});
    modalRef.componentInstance.hash_doctor = hash;
  }

  filtering(){
    this.pagina=1;
  }
}
