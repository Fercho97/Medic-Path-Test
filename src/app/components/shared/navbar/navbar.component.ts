import { Component, OnInit, NgZone } from '@angular/core';
import {Router} from '@angular/router';
import { TokenService } from '../../../services/token-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [TokenService]
})
export class NavbarComponent implements OnInit {

  user;
  isAdmin;
  isDoctor;
  tipoUsuario;
  constructor(private router : Router, private tokenServ : TokenService) { }

  public ngOnInit() {
    this.checkPermission();
  }

  logout(){
    sessionStorage.clear();
    localStorage.setItem('action','logout');
    window.location.replace('/home');
    
  }

  checkPermission(){
    this.user = false;
    this.isAdmin = false;
    this.isDoctor = false;
    this.tipoUsuario = this.tokenServ.getRole();
    if(this.tokenServ.getHash()!=null){
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
