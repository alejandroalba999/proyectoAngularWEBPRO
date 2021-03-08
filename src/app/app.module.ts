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

@NgModule({
  declarations: [
    AppComponent,
    AccesoUsuarioComponent,
    LoginUsuarioComponent,
    RecoveryPassComponent,
    DashboardComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RecaptchaModule,
    CommonModule
  ],
  exports:
    [
      AccesoUsuarioComponent,
      LoginUsuarioComponent,
      DashboardComponent

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
