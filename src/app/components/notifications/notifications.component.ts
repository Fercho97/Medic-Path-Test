import { Component, OnInit } from '@angular/core';
import {CryptoStorage} from '../../services/shared-service';
import {NotificacionService} from './notifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoMedicalRecordComponent } from '../profile/medical-record/info-medical-record/info-medical-record.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers: [NotificacionService,CryptoStorage]
})
export class NotificationsComponent implements OnInit {
  public notificaciones = [];
  content;
  constructor(private notifServ : NotificacionService, private storage: CryptoStorage,
              private modalService : NgbModal, private spinner : NgxSpinnerService,
              private toast: ToastrService) {
   }

  ngOnInit() {
    this.loadNotif();

  }


  openModal(info, hist : any){
    const modalRef = this.modalService.open(InfoMedicalRecordComponent, { windowClass : "myCustomModalClass"});
    modalRef.componentInstance.historial = hist;

    modalRef.result.then((result) => {
      this.loadNotif();
    });
  }

  loadNotif(){
    this.spinner.show();
    let hashCryp = this.storage.decryptData('hash');
    this.notifServ.getWithoutFeedback(hashCryp).subscribe( (res: any) =>{
      this.notificaciones = res.body.resultados;
      this.spinner.hide();
    },
  error =>{
    this.spinner.hide();
    this.toast.error('Hubo un error al conseguir sus notificaciones, favor de intentarlo de nuevo', 'Error')
      //console.log(error);
  })
  }
}
