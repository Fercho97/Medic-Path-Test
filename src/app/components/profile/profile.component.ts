import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {

    hash = sessionStorage.getItem('hash');
    usuario = {} as any;
    public url : string = "";

  constructor(private profileServ : ProfileService, private router : Router) {
    
   }

  ngOnInit() {
    this.profileServ.getUser(this.hash).subscribe( (res: any) =>{
      this.usuario = res.body.resultado;
      sessionStorage.setItem('token',res.body.token);
      if(this.usuario.imagen_perfil!=null){
        this.url = 'data:image/jpg;base64,' + this.usuario.imagen_perfil.toString();
      }
    },
  error =>{
      console.log(error);
  })
  }

}
