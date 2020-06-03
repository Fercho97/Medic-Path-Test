import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../profile.service';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../../services/token-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.css'],
  providers: [ProfileService,TokenService]
})
export class ProfilePicComponent implements OnInit {

  @Input() imagen: any;
  formData: any = new FormData();
  public selectedFile : File = null;
  public selectedImg = false;
  constructor(private profileServ : ProfileService, private toast : ToastrService, private router : Router
             ,private tokenServ : TokenService, private spinner : NgxSpinnerService) { 
  }

  ngOnInit() {
  }

  createFormData(event){
    this.selectedFile = <File>event.target.files[0];
    this.formData.append('image', this.selectedFile, this.selectedFile.name);
    this.selectedImg = true;
  }

  actualizarDatos(){
    let hash = this.tokenServ.getHash();
    this.spinner.show();
        this.profileServ.updateProfilePic(hash, this.formData).subscribe( (res: any) =>{
          sessionStorage.setItem('token',res.body.token);
          this.formData = new FormData();
          this.spinner.hide();
          window.location.reload();
          this.toast.success('Imagen cambiada con éxito!', 'Modificación Exitosa!');
        },
      error =>{
        //console.log(error.message);
          this.spinner.hide();
          this.toast.error('Hubo un error al actualizar su imagen, favor de reintentarlo','Error');
      })
    
  }
}
