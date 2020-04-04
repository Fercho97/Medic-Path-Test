import { Component, OnInit, NgZone } from '@angular/core';
import {Router} from '@angular/router';
import {CryptoStorage} from '../../../services/shared-service'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [CryptoStorage]
})
export class NavbarComponent implements OnInit {

  user;
  isAdmin;
  isDoctor;
  tipoUsuario;
  constructor(private router : Router,private storage: CryptoStorage) { }

  public ngOnInit() {
    this.checkPermission();
  }

  logout(){
    sessionStorage.clear();
    localStorage.setItem('action','logout');
    this.checkPermission();
    this.router.navigate(['/home']);
    
  }

  checkPermission(){
    this.user = false;
    this.isAdmin = false;
    this.isDoctor = false;
    this.tipoUsuario = this.storage.decryptData('tipoUsuario');
    if(this.storage.decryptData('usuario')!=null){
      this.user = true;
    }

    if(this.tipoUsuario==='2'){
      this.isDoctor = true;
    }
    else if(this.tipoUsuario==='3'){
      this.isAdmin = true;
    }
  }
}
