import { Component, OnInit } from '@angular/core';
import { UserService } from '../../servicios/user.service';
import { UsuarioModel } from '../../modelos/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { RecaptchaErrorParameters } from "ng-recaptcha";
import { Router } from '@angular/router';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
@Component({
  selector: 'app-acceso-usuario',
  templateUrl: './acceso-usuario.component.html',
  styleUrls: ['./acceso-usuario.component.css']
})

export class AccesoUsuarioComponent implements OnInit {
  captcha: Boolean = false;
  spinner: Boolean = false;
  registro: Boolean = false;
  UsuarioModel: UsuarioModel = new UsuarioModel();

  constructor(private _service: UserService, private router: Router) { }

  ngOnInit(): void {

  }
  async POST() {
    this.registro = true;
    this.spinner = true;
    this._service.getRecaptcha().then((data: any) => {
      console.log(data);
      console.log("HERE");


    }).catch((err: HttpErrorResponse) => {
      console.log(err);
      console.log("ERROR");


    })
    this._service.postUsuario(this.UsuarioModel).then((data: any) => {
      this.registro = false;
      this.spinner = false;
      Swal.fire({
        icon: "success",
        title: `${this.UsuarioModel.first_name} tu cuenta se agrego con exito`,
      });
      document.getElementById("exampleModal").click();
      this.router.navigateByUrl('/login');
    }).catch((err: HttpErrorResponse) => {
      this.registro = false;
      this.spinner = false;
      console.log(err.error.info);
      Swal.fire({
        icon: "error",
        title: "Hubo un problema",
        text: `${err.error.info.data.error_message}`,
      })

    });
  }
  limpiar(forma: NgForm) {
    forma.resetForm();
  }
  public resolved(captchaResponse: string): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.captcha = true;
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
    this.captcha = false;
  }
}
