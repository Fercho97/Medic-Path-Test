import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DiagnosticComponent } from './components/diagnostic/diagnostic.component';
import { SignupComponent } from './components/signup/signup.component';
import { AboutComponent } from './components/about/about.component';
import { FaqComponent } from './components/faq/faq.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { SintomasComponent } from './components/sintomas/sintomas.component';
import { PadecimientosComponent } from './components/padecimientos/padecimientos.component';
import { PadecimientosRoutes } from './components/padecimientos/padecimientos.routes';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { SintomasRoutes } from './components/sintomas/sintomas.routes';
import { VerificacionComponent} from './components/verificacion/verificacion.component';
import { ResetPasswordComponent} from './components/reset-password/reset-password.component';
import { UsuarioInfoComponent} from './components/usuario/usuarioInfo/usuarioInfo.component';
import { BDCComponent } from './components/bdc/bdc.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MedicalRecordComponent } from './components/profile/medical-record/medical-record.component';
import { MedicsComponent } from './components/directory/medics.component';
import { AdminGuardService } from './components/auth/admin-role-guard.service';
import { DoctorGuardService } from './components/auth/doctor-role-guard.service';
import { RegistryComponent } from './components/registry/registry.component';
import { GuidedDiagnosticComponent } from './components/guided-diagnostic/guided-diagnostic.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'diagnostico', component: DiagnosticComponent },
  { path: 'diagnosticoGuiado', component: GuidedDiagnosticComponent},
  { path: 'registro', component: SignupComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'record', component: MedicalRecordComponent },
  { path: 'medics/:type', component: MedicsComponent },
  { path: 'medics', component: MedicsComponent },
  { path: 'faq', component: FaqComponent },
  {
  path: 'sintomas',
  component: SintomasComponent,
  canActivate: [DoctorGuardService],
  children: SintomasRoutes
  },
  {
    path: 'padecimientos',
    component: PadecimientosComponent ,
    canActivate: [DoctorGuardService],
    children: PadecimientosRoutes
  },
  { path: 'usuarios', component: UsuarioComponent, canActivate: [AdminGuardService] },
  { path: 'recovery', component: ForgotPasswordComponent },
  { path: 'resetPass', component: ResetPasswordComponent},
  { path: 'emailSent', component: SendEmailComponent },
  { path: 'verificacion/:hash', component : VerificacionComponent},
  { path: 'recuperar/:hash', component : ResetPasswordComponent},
  { path: 'usuarios/info/:hash', component : UsuarioInfoComponent, canActivate: [AdminGuardService]},
  { path: 'bdc', component : BDCComponent},
  { path: 'registry', component: RegistryComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true}),
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
