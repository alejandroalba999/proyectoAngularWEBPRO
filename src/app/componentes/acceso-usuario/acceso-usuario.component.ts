import { Component, OnInit } from '@angular/core';
import { UserService } from '../../servicios/user.service';
import { UsuarioModel } from '../../modelos/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'

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


  UsuarioModel: UsuarioModel = new UsuarioModel();

  constructor(private _service: UserService) { }

  ngOnInit(): void {

  }
  async POST() {
    this._service.postUsuario(this.UsuarioModel).then((data: any) => {
      Swal.fire({
        icon: "success",
        title: `${this.UsuarioModel.first_name} tu cuenta se agrego con exito`,
      });
      setTimeout(() => {
        window.location.pathname = "/"
      }, 2000);


    }).catch((err: HttpErrorResponse) => {
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
}
