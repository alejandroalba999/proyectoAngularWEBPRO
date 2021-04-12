import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccesoUsuarioComponent } from './componentes/acceso-usuario/acceso-usuario.component';
import { LoginUsuarioComponent } from './componentes/login-usuario/login-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecoveryPassComponent } from './componentes/recovery-pass/recovery-pass.component';
import { DashboardComponent } from "./componentes/dashboard/dashboard.component";
import { DetalleProdComponent } from './componentes/dashboard/detalle-prod/detalle-prod.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { PedidosComponent } from './componentes/pedidos/pedidos.component';

@NgModule({
  declarations: [
    AppComponent,
    AccesoUsuarioComponent,
    LoginUsuarioComponent,
    RecoveryPassComponent,
    DashboardComponent,
    DetalleProdComponent,
    NavbarComponent,
    PedidosComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RecaptchaModule,
    CommonModule,
    NgxPayPalModule,
    NgxPaginationModule
  ],
  exports:
    [
      AccesoUsuarioComponent,
      LoginUsuarioComponent,
      DashboardComponent,
      DetalleProdComponent,
      NavbarComponent,
      PedidosComponent,
      NgxPaginationModule

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
