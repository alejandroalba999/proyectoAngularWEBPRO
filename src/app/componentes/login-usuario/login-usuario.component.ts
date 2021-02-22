import { Component, OnInit } from '@angular/core';
import { UserService } from '../../servicios/user.service';
import { CorreoModel, UsuarioModel } from '../../modelos/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { RecaptchaErrorParameters } from "ng-recaptcha";
import { Router } from '@angular/router';
//Encrypt and Decrypt
import * as CryptoJS from 'crypto-js';







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
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.css']
})
export class LoginUsuarioComponent implements OnInit {

  captcha: Boolean = false;
  spinner: Boolean = false;
  UsuarioModel: UsuarioModel = new UsuarioModel();
  CorreoModel: CorreoModel = new CorreoModel();
  contraseña: string;
  SECRET_KEY = "llaveSecreta";
  constructor(private _service: UserService, private router: Router) { }

  ngOnInit(): void {
    let a = this.encrypt("este es el token ba");
    this.decrypt(a);


    this.contraseña = "contraseña"
    if (localStorage.getItem("ReenviarPinContraseña") == "true") {
      document.getElementById("openModal").click();
      localStorage.removeItem("ReenviarPinContraseña");
    }
  }

  limpiar(forma: NgForm) {
    forma.resetForm();
  }
  async recoveryPass() {
    this.spinner = true;

    await this._service.recoveryPassword(this.CorreoModel).then((res: any) => {

      if (res.status == "error") {
        this.spinner = false;
        Swal.fire({
          icon: "error",
          title: res.error_message,
        });
      } else if (res.status == "success") {
        localStorage.setItem("emailUser", `${this.CorreoModel.email}`);
        this.spinner = false;
        Swal.fire({
          icon: "success",
          title: "Por favor revise su correo electronico",
        });
        document.getElementById("exampleModal").click();
        this.router.navigateByUrl('/recovery_password');
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err);
      this.spinner = false;
    })
  }
  registrar() {
    this.router.navigateByUrl('/accesoUsuario')
    //comentario para resubir este cambio
  }
  encrypt(dataToEncrypt) {

    let data = CryptoJS.AES.encrypt(dataToEncrypt, this.SECRET_KEY);

    data = data.toString();
    console.log("Encriptado", data);
    return data;


  }

  decrypt(dataToDecrypt) {
    let data = CryptoJS.AES.decrypt(dataToDecrypt, this.SECRET_KEY);

    data = data.toString(CryptoJS.enc.Utf8);
    console.log("token-desencriptado:", data);

    return data;
  }


}
