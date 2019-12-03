import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges  } from '@angular/core';
import { Padecimiento } from '../../../interfaces/padecimiento.interface';
import { PadecimientoService } from '../padecimientos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoPadecimientosComponent } from '../info-padecimientos/info-padecimientos.component';

@Component({
  selector: 'app-listar-padecimientos',
  templateUrl: './listar-padecimientos.component.html',
  styleUrls: ['./listar-padecimientos.component.css'],
  providers: [PadecimientoService]
})
export class ListarPadecimientosComponent implements OnInit {
  
  pagina = 0;
  private padecimientos : Padecimiento[] = [];
  constructor(private padServ : PadecimientoService, private modalService : NgbModal) { 

  }

  ngOnInit() {
    this.padServ.getPads().subscribe( (res: any) =>{
      this.padecimientos = res.body;

      if(this.padecimientos){
        this.pagina=1;
      }
    },
  error =>{
      console.log(error);
  })
  }

  openModal(info, pad : any){
    const modalRef = this.modalService.open(InfoPadecimientosComponent, { windowClass : "myCustomModalClass"});
    modalRef.componentInstance.pad = pad;
  }

  filtering(){
    this.pagina=1;
  }
}
