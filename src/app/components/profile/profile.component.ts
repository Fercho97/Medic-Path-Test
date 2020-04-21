import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import {Router} from '@angular/router';
import {CryptoStorage} from '../../services/shared-service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService,CryptoStorage]
})
export class ProfileComponent implements OnInit {
    usuario = {} as any;
    public url : string = "/assets/default-image.jpg";

  constructor(private profileServ : ProfileService, private router : Router,private storage: CryptoStorage) {
    
   }

  ngOnInit() {
    let hashCryp = this.storage.decryptData('hash');
    this.profileServ.getUser(hashCryp).subscribe( (res: any) =>{
      this.usuario = res.body.resultado;
      sessionStorage.setItem('token',res.body.token);
      if(this.usuario.imagen_perfil!=null){
        this.url = this.usuario.imagen_perfil;
      }
    },
  error =>{
      //console.log(error);
  })
  }

  actualizar(){
    this.profileServ.updateRules().subscribe(res =>{
      //console.log('Done');
    })
  }
}
