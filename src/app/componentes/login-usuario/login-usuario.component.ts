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
  contrasenia: string;
  correoEncrip: string;
  contraseniaEcrip: string;
  SECRET_KEY = "llaveSecreta";
  isChecked: Boolean = false;
  recordarCuenta: Boolean;
  sessionId: string;
  dataCustomer: any;

  constructor(private _service: UserService, private router: Router) { }

  ngOnInit(): void {

    this.validarCredenciales();

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
    return data;
  }

  login() {
    this._service.login(this.UsuarioModel).then((res: any) => {

      if (res.status == "error") {
        this.spinner = false;
        Swal.fire({
          icon: "error",
          title: res.error_message,
        });
      } else if (res.status == "success") {
        Toast.fire({
          icon: 'info',

          title: `¡Bienvenido ${res.data.customer.first_name} ${res.data.customer.middle_name} ${res.data.customer.last_name}!  `
        });

        this.dataCustomer = res.data.customer;
        console.log(this.dataCustomer)
        this.sessionId = res.data.session_id;

        localStorage.setItem('customer', this.encrypt(JSON.stringify(this.dataCustomer)));
        localStorage.setItem('sesionID', this.encrypt(this.sessionId));



        if (this.isChecked) {

          this.contraseniaEcrip = this.encrypt(this.UsuarioModel.password);
          this.correoEncrip = this.encrypt(this.UsuarioModel.email);
          localStorage.setItem('correo', this.correoEncrip);
          localStorage.setItem('contraseña', this.contraseniaEcrip)

        } else {
          localStorage.removeItem('correo');
          localStorage.removeItem('contraseña');
        }
        if (localStorage.getItem('urlTemporal')) {
          console.log(localStorage.getItem('urlTemporal'));
          this.router.navigateByUrl(localStorage.getItem('urlTemporal'));
          localStorage.removeItem('urlTemporal');
        } else {
          this.router.navigateByUrl('');
        }
      }

    }).catch((err) => {
      console.log(err
      )
    })
  }

  validarCredenciales() {
    if (localStorage.getItem('sesionID')) {
      this.isChecked = true;
      this.router.navigateByUrl('/dashboard')
    }
    if (localStorage.getItem('correo') && localStorage.getItem('contraseña')) {
      this.isChecked = true;
    }
    if (this.isChecked) {
      this.UsuarioModel.email = this.decrypt(localStorage.getItem('correo'));
      this.UsuarioModel.password = this.decrypt(localStorage.getItem('contraseña'));
    }

  }

}
