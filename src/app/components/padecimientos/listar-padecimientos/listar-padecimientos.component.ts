import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges  } from '@angular/core';
import { Padecimiento } from '../../../interfaces/padecimiento.interface';
import { PadecimientoService } from '../padecimientos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoPadecimientosComponent } from '../info-padecimientos/info-padecimientos.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-listar-padecimientos',
  templateUrl: './listar-padecimientos.component.html',
  styleUrls: ['./listar-padecimientos.component.css'],
  providers: [PadecimientoService]
})
export class ListarPadecimientosComponent implements OnInit {
  
  pagina = 0;
  public padecimientos : Padecimiento[] = [];
  key :string = 'nombre_pad';
  reversa : boolean = false;
  public myFilter : any = "";
  public mySearch : any = "";
  public searching: boolean = false;
  content;
  constructor(private padServ : PadecimientoService, private modalService : NgbModal,
              private spinner : NgxSpinnerService, private toast : ToastrService) { 

  }

  ngOnInit() {
    this.spinner.show();
    this.padServ.getPads().subscribe( (res: any) =>{
      this.padecimientos = res.body.padecimientos;
      sessionStorage.setItem('token',res.body.token);
      if(this.padecimientos){
        this.pagina=1;
      }
      this.spinner.hide();
    },
  error =>{
    this.spinner.hide();
    this.toast.error('Error al conseguir la información de los padecimientos', 'Error');
      //console.log(error);
  })
  }

  openModal(info, pad : any){
    const modalRef = this.modalService.open(InfoPadecimientosComponent, { windowClass : "myCustomModalClass"});
    modalRef.componentInstance.pad = pad;
  }

  filtering(){
    this.pagina=1;
  }

  sorting(key : any){
    this.key = key;
    this.reversa = !this.reversa;
  }

  showResults(event :any){
    if(event.target.value.length >= 1){
      this.searching= true;
    }else{
      this.searching=false;
    }
  }

  selection(name: any){
    this.mySearch =name;
    this.myFilter=name;
    this.pagina = 1;
    this.searching=false;
  }
  
  remove(){
    this.myFilter="";
    this.mySearch="";
    this.searching=false;
  }

  focusLost(){
    this.myFilter=this.mySearch;
  }
}
