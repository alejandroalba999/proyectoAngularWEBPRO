import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccesoUsuarioComponent } from './componentes/acceso-usuario/acceso-usuario.component';

const routes: Routes =
  [
    {
      path: 'accesoUsuario', component: AccesoUsuarioComponent, data: { breadcrumb: 'Acceso' },
    }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
