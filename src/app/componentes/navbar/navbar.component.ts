import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../modelos/usuario.model';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { ProductoService } from "../../servicios/producto.service"


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  UsuarioModel: UsuarioModel = new UsuarioModel();

  SECRET_KEY = "llaveSecreta";

  session_id: any;
  sessionDecrypted: any;
  contadorCarrito: any = 0;
  sessionID = {
    session_id: ''
  }
  iniciarBoton: boolean;

  constructor(private router: Router, private _productoService: ProductoService) { }

  ngOnInit(): void {
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

  obtenerCarrito() {
    this.session_id = localStorage.getItem('sesionID');

    if (this.session_id) {
      this.sessionDecrypted = this.decrypt(this.session_id);
      this.sessionID.session_id = this.sessionDecrypted;
      this._productoService.obtenerCarrito(this.sessionID).then((data: any) => {
        this.contadorCarrito = data.data.items_quantity
      }).catch((err: any) => {
        console.log(err)
      })
    }
  }

}
