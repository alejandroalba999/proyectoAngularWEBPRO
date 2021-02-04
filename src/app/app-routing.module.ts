import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccesoUsuarioComponent } from './componentes/acceso-usuario/acceso-usuario.component';
import { LoginUsuarioComponent } from './componentes/login-usuario/login-usuario.component';
import { RecoveryPassComponent } from './componentes/recovery-pass/recovery-pass.component';

const routes: Routes =
  [
    {
      path: '', component: LoginUsuarioComponent, data: { breadcrumb: 'Login', },
    },
    {
      path: 'accesoUsuario', component: AccesoUsuarioComponent, data: { breadcrumb: 'Acceso' },
    },
    {
      path: 'login', component: LoginUsuarioComponent, data: { breadcrumb: 'Login', },
    },
    {
      path: 'recovery_password', component: RecoveryPassComponent, data: { breadcrumb: 'Recovery Password', },
    }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
