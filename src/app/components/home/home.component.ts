import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private toast : ToastrService) {  }

  ngOnInit() {
    if(localStorage.getItem('action')=='login'){
      this.toast.success('Bienvenido al sistema Medic Path ' +  sessionStorage.getItem('nickname'), 'Éxito!');
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
