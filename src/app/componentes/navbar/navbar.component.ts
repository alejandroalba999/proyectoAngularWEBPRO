import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../modelos/usuario.model';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { ProductoService } from "../../servicios/producto.service"
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Button } from 'selenium-webdriver';
import { ICreateOrderRequest, IPayPalConfig } from "ngx-paypal";

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
  taxes: Number;
  totalPrice: String = '0';
  subTotalPrice: String = '0';
  session_id: any;
  sessionDecrypted: any;
  contadorCarrito: any = 0;
  sessionID = {
    session_id: ''
  }
  iniciarBoton: boolean;

  compraExitosa: Boolean = false;

  mostrarPago: Boolean = false;

  datosCompra: any;
  public payPalConfig?: IPayPalConfig;

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
  async obtenerCarritoClick() {
    await this._productoService.obtenerCarrito(this.sessionID).then((data: any) => {
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
        this.taxes = data.data.taxes;
        this.subTotalPrice = data.data.sub_total;
        if (this.items == undefined) {
          location.href = "/dashboard"
        }
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }
  async obtenerCarrito() {
    this.session_id = localStorage.getItem('sesionID');

    if (this.session_id) {
      this.sessionDecrypted = this.decrypt(this.session_id);
      this.sessionID.session_id = this.sessionDecrypted;
      await this._productoService.obtenerCarrito(this.sessionID).then((data: any) => {
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
          console.log(data.data);

          this.contadorCarrito = data.data.items_quantity
          this.items = data.data.items;
          this.totalPrice = data.data.total;
          this.taxes = data.data.taxes;
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
            this.obtenerCarritoClick();
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
                this.obtenerCarritoClick();
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
      if (this.items != undefined) {
        document.getElementById("btn-disabled").click();
      }

    }
    this.mostrarPago = false;
  }

  validarModal() {
    if (localStorage.getItem('blnModalCarrito') == "true") {
      if (this.items.length > 0) {
        console.log(this.items.length);

        document.getElementById("btn-disabled").click();
      }
      localStorage.removeItem('blnModalCarrito')
    }
    this.mostrarPago = false;
  }
  eliminarTodo() {
    Swal.fire({
      title: '¿Estas seguro de querer eliminar todos  los  producto del carrito?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      reverseButtons: true
    }).then((res) => {
      if (res.isConfirmed) {
        let body = { "session_id": this.sessionID.session_id }
        this._productoService.eliminarTodoById(body).then((res: any) => {
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
              'Productos eliminados!',
              'Se eliminaron los productos exitosamente',
              'success'
            )
            location.href = "/dashboard"
          }

          console.log(res.status);

        }).catch((err) => {
          console.log(err);

        })
      }
    })

  }

  regresar() {
    this.mostrarPago = false;
  }

  cerrarModal() {
    this.mostrarPago = false;
  }

  procederPago() {
    this.mostrarPago = true;
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'MXN',
      clientId: 'Adt8PG7veb1bas7VKF9tjadhw430t-LfRj96vXehx9a0W8lKGe5r4mR2lM9knIcaL7miRvkyZGSIIQ3V',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'MXN',
              value: this.totalPrice,
              breakdown: {
                item_total: {
                  currency_code: 'MXN',
                  value: this.totalPrice
                }
              }
            },
            items: [
              {
                name: 'Servicio',
                quantity: '1',
                unit_amount: {
                  currency_code: 'MXN',
                  value: this.totalPrice,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },

      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

        let json = {
          session_id: this.sessionDecrypted,
          paypal_payment_details: data
        }
        this._productoService.registrarCompra(json).then((res: any) => {

          if (res.status == "error") {
            Toast.fire({
              icon: 'error',
              title: `¡Error: ${res.error_message}!`
            });
          }
          if (res.status == "success") {
            Swal.fire(
              '¡Gracias por tu compra!',
              'En breve te enviaremos un correo con los detalles de tu compra e instrucciones para la activación de tus productos o servicios.',
              'success'
            )
            this.datosCompra = res.original_request.paypal_payment_details;
            console.log(this.datosCompra)
            this.compraExitosa = true;
            this.mostrarPago = false;
          }

        }).catch((err: any) => {
          console.log(err)
        })

      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }


}
