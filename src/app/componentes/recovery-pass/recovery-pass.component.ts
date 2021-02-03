import { Component, OnInit } from '@angular/core';
import { UserService } from '../../servicios/user.service';
import { CorreoModel, PinModel, UsuarioModel } from '../../modelos/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
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

  PinModel: PinModel = new PinModel();
  CorreoModel: CorreoModel = new CorreoModel();
  correo = localStorage.getItem("emailUser");
  constructor(private _service: UserService) { }

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
      location.href = "/login";
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
        this.spinner = false;
        Swal.fire({
          icon: "success",
          title: "Aqui va tu codigo Natanito",
        });

      }

    }).catch((err: HttpErrorResponse) => {
      console.log(err);

    })
  }
}