import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../profile.service';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.css'],
  providers: [ProfileService]
})
export class ProfilePicComponent implements OnInit {

  @Input() imagen: any;
  formData: any = new FormData();
  public selectedFile : File = null;
  public selectedImg = false;
  hash = sessionStorage.getItem('hash');
  constructor(private profileServ : ProfileService, private toast : ToastrService, private router : Router) { 
  }

  ngOnInit() {
  }

  createFormData(event){
    this.selectedFile = <File>event.target.files[0];
    this.formData.append('image', this.selectedFile, this.selectedFile.name);
    this.selectedImg = true;
  }

  actualizarDatos(){
        this.profileServ.updateProfilePic(this.hash, this.formData).subscribe( (res: any) =>{
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
