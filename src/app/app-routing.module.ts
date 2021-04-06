import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccesoUsuarioComponent } from './componentes/acceso-usuario/acceso-usuario.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { DetalleProdComponent } from './componentes/dashboard/detalle-prod/detalle-prod.component';
import { LoginUsuarioComponent } from './componentes/login-usuario/login-usuario.component';
import { PedidosComponent } from './componentes/pedidos/pedidos.component';
import { RecoveryPassComponent } from './componentes/recovery-pass/recovery-pass.component';

const routes: Routes =
  [
    {
      path: '', component: DashboardComponent, data: { breadcrumb: 'Login', },
    },
    {
      path: 'accesoUsuario', component: AccesoUsuarioComponent, data: { breadcrumb: 'Acceso' },
    },
    {
      path: 'login', component: LoginUsuarioComponent, data: { breadcrumb: 'Login', },
    },
    {
      path: 'recovery_password', component: RecoveryPassComponent, data: { breadcrumb: 'Recovery Password', },
    },
    { path: 'dashboard', component: DashboardComponent },

    { path: 'detalle-producto/:idProducto', component: DetalleProdComponent },

    { path: 'pedidos', component: PedidosComponent }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
