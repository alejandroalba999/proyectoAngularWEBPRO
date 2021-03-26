import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../modelos/usuario.model';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { ProductoService } from "../../servicios/producto.service"
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Button } from 'selenium-webdriver';
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
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  UsuarioModel: UsuarioModel = new UsuarioModel();

  SECRET_KEY = "llaveSecreta";

  items: any = [];
  totalPrice: Number = 0;
  subTotalPrice: Number = 0;
  session_id: any;
  sessionDecrypted: any;
  contadorCarrito: any = 0;
  sessionID = {
    session_id: ''
  }
  iniciarBoton: boolean;

  constructor(private router: Router, private _productoService: ProductoService) { }

  ngOnInit(): void {
    this.validarModal();
    this.usuario();
    this.validar();
    this.obtenerCarrito();
  }


  validar() {
    if (!localStorage.getItem('sesionID')) {
      this.iniciarBoton = false;
    } else {
      this.iniciarBoton = true;
    }
  }
  usuario() {
    let dataUser = this.decrypt(localStorage.getItem("customer"))
    let json = JSON.parse(dataUser);
    this.UsuarioModel.first_name = json.first_name;
    this.UsuarioModel.middle_name = json.middle_name;
  }

  logout() {
    localStorage.removeItem('sesionID');
    localStorage.removeItem('customer');
    location.href = "/";
  }
  iniciarSesion() {
    if (!localStorage.getItem('sesionID')) {
      this.router.navigateByUrl('/login')
    } else {
      this.router.navigateByUrl('/dashboard')
    }
  }

  decrypt(dataToDecrypt) {
    let data = CryptoJS.AES.decrypt(dataToDecrypt, this.SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }

  async obtenerCarrito() {
    this.session_id = localStorage.getItem('sesionID');

    if (this.session_id) {
      this.sessionDecrypted = this.decrypt(this.session_id);
      this.sessionID.session_id = this.sessionDecrypted;
      await this._productoService.obtenerCarrito(this.sessionID).then((data: any) => {
        console.log(data);

        if (data.error_code) {
          if (data.error_code == "SessionExpired" || data.error_code == "SessionInvalidForThisBrowserIP") {
            Toast.fire({
              icon: 'error',
              title: `Tu sesión a expirado`
            });
            localStorage.removeItem('sesionID');
            location.href = "/login";
          }
        }


        if (data.data) {
          this.contadorCarrito = data.data.items_quantity
          this.items = data.data.items;
          this.totalPrice = data.data.total;
          this.subTotalPrice = data.data.sub_total;
        }
      }).catch((err: any) => {
        console.log(err)
      })
    }
  }
  remove(nombre, id) {
    Swal.fire({
      title: '¿Estas seguro de cancelar este producto?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        let body = {
          "session_id": this.sessionID.session_id,
          "item_id": id
        }
        this._productoService.eliminarProductoById(body).then((res: any) => {
          if (res.error_code) {
            if (res.error_code == "SessionExpired" || res.error_code == "SessionInvalidForThisBrowserIP") {
              Toast.fire({
                icon: 'error',
                title: `Tu sesión a expirado`
              });
              localStorage.removeItem('sesionID');
              location.href = "/login";
            }
          }

          if (res.status == "success") {
            Swal.fire(
              'Producto eliminado!',
              'Se a eliminado el producto exitosamente',
              'success'
            )
            this.obtenerCarrito();
          }


        }).catch((err: HttpErrorResponse) => {
          console.log(err);

        })

      }
    })
  }

  actualizar(i, id, nombre) {

    var slider = <HTMLInputElement>document.getElementById('exampleInputEmail' + i);
    if (slider) {
      console.log(parseInt(slider.value));

      if (parseInt(slider.value) < 1 || slider.value == "") {
        Swal.fire({
          icon: 'error',
          title: 'Es necesario ingresar un valor mayor a 0'
        });
      } else {
        let body = {
          "session_id": this.sessionID.session_id,
          "item_id": id,
          "item_quantity": slider.value
        }

        Swal.fire({
          title: '¿Estas seguro de actualizar este producto?',
          text: nombre,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar',
          reverseButtons: true
        }).then((res) => {
          if (res.isConfirmed) {
            this._productoService.actualizarProductoById(body).then((res: any) => {
              console.log(res);

              if (res.error_code) {
                if (res.error_code == "SessionExpired" || res.error_code == "SessionInvalidForThisBrowserIP") {
                  Toast.fire({
                    icon: 'error',
                    title: `Tu sesión a expirado`
                  });
                  localStorage.removeItem('sesionID');
                  location.href = "/login";
                }
              }
              if (res.status == "success") {
                Swal.fire(
                  'Producto Actualizado!',
                  'Se realizo la actualización exitosamente',
                  'success'
                )
                this.obtenerCarrito();
              }

            }).catch((err) => {
              console.log(err);

            })
          }
        })
      }


    }

  }
  validarSesion() {
    if (this.sessionID.session_id == '') {
      location.href = '/login';
      localStorage.setItem('blnModalCarrito', "true");
    } else {
      document.getElementById("btn-disabled").click();
    }
  }
  validarModal() {
    console.log(localStorage.getItem('blnModalCarrito'))
    if (localStorage.getItem('blnModalCarrito') == "true") {
      document.getElementById("btn-disabled").click();
      localStorage.removeItem('blnModalCarrito')
    }
  }
}
