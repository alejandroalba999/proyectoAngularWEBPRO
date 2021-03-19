import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/servicios/producto.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  selector: 'app-detalle-prod',
  templateUrl: './detalle-prod.component.html',
  styleUrls: ['./detalle-prod.component.css']
})
export class DetalleProdComponent implements OnInit {


  idProducto: number = 7;
  producto: any;
  descripcion: any;
  htmlStr: string;
  session_id: any;
  carrito = {
    session_id: '',
    item_id: 1,
    item_quantity: ''
  };
  sessionDecrypted: any;
  cantidad: any = 1;
  SECRET_KEY = "llaveSecreta";

  constructor(private _productoService: ProductoService, activatedRouter: ActivatedRoute, private router: Router) {
    this.idProducto = activatedRouter.snapshot.params.idProducto;
  }

  ngOnInit(): void {
    this.getProducto();
  }

  getProducto() {
    this._productoService.getProductoID(this.idProducto).then((resp: any) => {
      this.producto = resp.data.items[0];
      console.log(this.producto);

      this.htmlStr = this.producto.html_details;

    }).catch((err) => {
      console.log(err)
    });
  }

  decrypt(dataToDecrypt) {
    let data = CryptoJS.AES.decrypt(dataToDecrypt, this.SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }

  guardarCarrito() {

    this.session_id = localStorage.getItem('sesionID');

    if (this.session_id) {
      this.sessionDecrypted = this.decrypt(this.session_id);

      this.carrito.session_id = this.sessionDecrypted;
      this.carrito.item_id = this.idProducto;
      this.carrito.item_quantity = this.cantidad;

      this._productoService.guardarCarrito(this.carrito).then((data: any) => {
        console.log(data)
        if (data.status == "error") {
          this.carrito.session_id = '';
          this.carrito.item_id = 1;
          this.carrito.item_quantity = '';
          Toast.fire({
            icon: 'error',
            title: `¡Error: ${data.error_message}!`
          });
        } else if (data.status == "success") {
          console.log(this.carrito.session_id);

          Toast.fire({
            icon: 'info',
            title: `¡Productos agregados correctamente al carrito!  `
          });

          this.carrito.session_id = '';
          this.carrito.item_id = 1;
          this.carrito.item_quantity = '';
          location.href = "/dashboard"
          this.ngOnInit()
        }
      }).catch((err: any) => {
        console.log(err)
      });
    } else {
      Toast.fire({
        icon: 'error',
        title: `No existe un session_id valido`
      });
      this.router.navigateByUrl('/login');
    }

  }


}
