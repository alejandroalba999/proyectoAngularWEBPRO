import { Component, OnInit } from '@angular/core';
import { UserService } from '../../servicios/user.service';
import { CorreoModel, PinModel, UsuarioModel } from '../../modelos/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RecaptchaErrorParameters } from "ng-recaptcha";


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
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.css']
})
export class RecoveryPassComponent implements OnInit {

  captcha: Boolean = false;
  spinner: Boolean = false;
  valido: Boolean = false;


  PinModel: PinModel = new PinModel();
  UsuarioModel: UsuarioModel = new UsuarioModel();
  CorreoModel: CorreoModel = new CorreoModel();
  correo = localStorage.getItem("emailUser");
  constructor(private _service: UserService, private router: Router) { }

  ngOnInit(): void {
  }
  ReenviarPin() {
    if (localStorage.getItem("emailUser")) {
      this.CorreoModel.email = this.correo;
      this._service.recoveryPassword(this.CorreoModel).then((res: any) => {
        console.log(res);

        Swal.fire({
          icon: "success",
          title: "Por favor revise su correo electronico",
        });
      }).catch((err: HttpErrorResponse) => {

      });
    } else {
      localStorage.setItem("ReenviarPinContraseña", "true");
      this.router.navigateByUrl('/login');
    }

  }

  limpiar(forma: NgForm) {
    forma.resetForm();
  }
  sendPIN() {
    this.PinModel.email = this.correo;
    console.log(this.PinModel);

    this._service.validateRecoveryCode(this.PinModel).then((res: any) => {
      console.log(res);
      if (res.status == "error") {
        this.spinner = false;
        Swal.fire({
          icon: "error",
          title: res.error_message,
        });

      } else if (res.status == "success") {
        this.valido = true;
        this.spinner = false;
        localStorage.setItem("recovery_code", `${this.PinModel.recovery_code}`);
      }

    }).catch((err: HttpErrorResponse) => {
      console.log(err);
      this.valido = false;
    })
  }

  cambiarContrasenia() {


    this.UsuarioModel.email = this.correo;
    this.UsuarioModel.recovery_code = localStorage.getItem("recovery_code");
    console.log(this.UsuarioModel.password);
    console.log(this.UsuarioModel.password_confirmation);

    console.log(this.UsuarioModel);

    this._service.changePassword(this.UsuarioModel).then((res: any) => {
      if (res.status == "error") {
        this.spinner = false;
        Swal.fire({
          icon: "error",
          title: res.error_message,
        });

      } else if (res.status == "success") {
        this.spinner = false;
        Swal.fire({
          icon: 'success',
          title: 'Se ha actualizado su contraseña correctamente!'
        })
        localStorage.removeItem("emailUser")
        localStorage.removeItem("recovery_code");

        this.router.navigateByUrl('/login');
      }


    }).catch((err: any) => {
      Swal.fire({
        icon: 'error',
        title: err
      });
      console.log(err)
    })

  }




}