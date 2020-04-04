import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../profile.service';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {CryptoStorage} from '../../../services/shared-service';
@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.css'],
  providers: [ProfileService,CryptoStorage]
})
export class ProfilePicComponent implements OnInit {

  @Input() imagen: any;
  formData: any = new FormData();
  public selectedFile : File = null;
  public selectedImg = false;
  constructor(private profileServ : ProfileService, private toast : ToastrService, private router : Router
             ,private storage: CryptoStorage) { 
  }

  ngOnInit() {
  }

  createFormData(event){
    this.selectedFile = <File>event.target.files[0];
    this.formData.append('image', this.selectedFile, this.selectedFile.name);
    this.selectedImg = true;
  }

  actualizarDatos(){
    let hash = this.storage.decryptData('hash');
        this.profileServ.updateProfilePic(hash, this.formData).subscribe( (res: any) =>{
          sessionStorage.setItem('token',res.body.token);
          this.formData = new FormData();
          window.location.reload();
          this.toast.success('Imagen cambiada con éxito!', 'Modificación Exitosa!');
        },
      error =>{
        console.log(error.message);
          this.toast.error(error.error.message,'Error');
      })
    
  }
}
