import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { DiagnosticComponent } from './components/diagnostic/diagnostic.component';
import { TreatmentComponent } from './components/treatment/treatment.component';
import { AboutComponent } from './components/about/about.component';
import { SignupComponent } from './components/signup/signup.component';
import { FaqComponent } from './components/faq/faq.component';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { SintomasComponent } from './components/sintomas/sintomas.component';
import { PadecimientosComponent } from './components/padecimientos/padecimientos.component';
import { ListarPadecimientosComponent } from './components/padecimientos/listar-padecimientos/listar-padecimientos.component';
import { AgregarPadecimientosComponent } from './components/padecimientos/agregar-padecimientos/agregar-padecimientos.component';
import { ModificarPadecimientosComponent } from './components/padecimientos/modificar-padecimientos/modificar-padecimientos.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { InfoSintomasComponent } from './components/sintomas/info-sintomas/info-sintomas.component';
import { ListarSintomasComponent } from './components/sintomas/listar-sintomas/listar-sintomas.component';
import { AgregarSintomasComponent } from './components/sintomas/agregar-sintomas/agregar-sintomas.component';
import { ModificarSintomasComponent} from './components/sintomas/modificar-sintomas/modificar-sintomas.component';
import { VerificacionComponent } from './components/verificacion/verificacion.component';
import { ResetPasswordComponent} from './components/reset-password/reset-password.component';
import { OwlModule } from 'ngx-owl-carousel';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsuarioInfoComponent} from './components/usuario/usuarioInfo/usuarioInfo.component';
import { InfoPadecimientosComponent } from './components/padecimientos/info-padecimientos/info-padecimientos.component';
import { BDCComponent } from './components/bdc/bdc.component';
import { NgbModule, NgbActiveModal, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ListFilter } from './pipes/filter.pipe';
import { OrderModule } from 'ngx-order-pipe';
import { ProfileComponent } from './components/profile/profile.component';
import { SubmenuComponent } from './components/profile/submenu/submenu.component';
import { ProfilePicComponent } from './components/profile/profile-pic/profile-pic.component';
import { ProfileInfoComponent } from './components/profile/profile-info/profile-info.component';
import { MedicalRecordComponent } from './components/profile/medical-record/medical-record.component';
import { InfoMedicalRecordComponent} from './components/profile/medical-record/info-medical-record/info-medical-record.component';
import { MedicsComponent } from './components/directory/medics.component';
import { InfoMedicComponent } from './components/directory/info-medic/info-medic.component';
import { AuthInterceptorService } from "./components/auth/interceptor.service";
import { RegistryComponent } from './components/registry/registry.component';
import { SearchPipe } from './pipes/search.pipe';
import { GuidedDiagnosticComponent } from './components/guided-diagnostic/guided-diagnostic.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    DiagnosticComponent,
    TreatmentComponent,
    AboutComponent,
    SignupComponent,
    FaqComponent,
    FirstLetterPipe,
    LoginComponent,
    ForgotPasswordComponent,
    SendEmailComponent,
    SintomasComponent,
    PadecimientosComponent,
    ListarPadecimientosComponent,
    AgregarPadecimientosComponent,
    ModificarPadecimientosComponent,
    UsuarioComponent,
    InfoSintomasComponent,
    ListarSintomasComponent,
    AgregarSintomasComponent,
    ModificarSintomasComponent,
    VerificacionComponent,
    ResetPasswordComponent,
    UsuarioInfoComponent,
    InfoPadecimientosComponent,
    BDCComponent,
    ListFilter,
    ProfileComponent,
    SubmenuComponent,
    ProfilePicComponent,
    ProfileInfoComponent,
    MedicalRecordComponent,
    MedicsComponent,
    InfoMedicComponent,
    InfoMedicalRecordComponent,
    RegistryComponent,
    SearchPipe,
    GuidedDiagnosticComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    OwlModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    DragDropModule,
    ScrollingModule,
    NgxPaginationModule,
    OrderModule,
    NgbProgressbarModule
    ],
  providers: [NgbActiveModal,{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent],
  
  entryComponents: [InfoSintomasComponent, InfoPadecimientosComponent, InfoMedicalRecordComponent, InfoMedicComponent]
})
export class AppModule { }
