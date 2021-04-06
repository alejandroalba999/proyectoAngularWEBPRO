import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ProductoService } from "../../servicios/producto.service"
import Swal from 'sweetalert2';

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
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  session_id: any;
  sessionDecrypted: any;
  sessionID = {
    session_id: ''
  }
  ordenes: any;

  ordenesContados: any = 0;

  SECRET_KEY = "llaveSecreta";

  constructor(private _productoService: ProductoService) { }

  ngOnInit(): void {

    this.session_id = localStorage.getItem('sesionID');
    this.sessionDecrypted = this.decrypt(this.session_id);
    this.sessionID.session_id = this.sessionDecrypted;
    this.obtenerOrdenes();
  }

  decrypt(dataToDecrypt) {
    let data = CryptoJS.AES.decrypt(dataToDecrypt, this.SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }

  obtenerOrdenes() {
    console.log(this.sessionID)
    this._productoService.obtenerOrdenes(this.sessionID).then((res: any) => {
      if (res.status == "error") {
        Toast.fire({
          icon: 'error',
          title: `¡Error: ${res.error_message}!`
        });
      } else {
        this.ordenes = res.data.orders;
        this.ordenesContados = res.data.orders.length;

        console.log(this.ordenesContados)
      }

    }).catch((err: any) => {
      console.log(err
      )
    })
  }

}
