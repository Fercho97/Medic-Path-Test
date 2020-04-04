import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {CryptoStorage} from '../../services/shared-service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [CryptoStorage]
})
export class HomeComponent implements OnInit {

  constructor(private toast : ToastrService,private storage: CryptoStorage) {  }

  ngOnInit() {
    if(localStorage.getItem('action')=='login'){
      this.toast.success('Bienvenido al sistema Medic Path ' +  this.storage.decryptData('nickname'), 'Éxito!');
    }
    else if(localStorage.getItem('action')=='logout'){
      this.toast.success('Logout', 'Vuelva pronto');  
    }else if(localStorage.getItem('action')=="inactividad"){
      this.toast.warning('Sesión cerrada por inactividad','Termino de sesión')
      window.location.reload();
    }
    localStorage.clear();
  }

}
