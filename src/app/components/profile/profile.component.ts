import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService,TokenService]
})
export class ProfileComponent implements OnInit {
    usuario = {} as any;
    public url : string = "/assets/default-image.jpg";
    userType;
  constructor(private profileServ : ProfileService, private router : Router,
              private toast: ToastrService, private tokenServ : TokenService) {
    
   }

  ngOnInit() {
    this.userType = this.tokenServ.getRole();
    let hashCryp = this.tokenServ.getHash();
    this.profileServ.getUser(hashCryp).subscribe( (res: any) =>{
      this.usuario = res.body.resultado;
      sessionStorage.setItem('token',res.body.token);
      if(this.usuario.imagen_perfil!=null){
        this.url = this.usuario.imagen_perfil;
      }
    },
  error =>{
    this.toast.error('Hubo un error al conseguir su información, favor de recargar la página','Error');
      //console.log(error);
  })
  }

}
