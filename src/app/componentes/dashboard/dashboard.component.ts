import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../modelos/usuario.model';
import { CategoriaService } from "../../servicios/categoria.service";
import { ProductoService } from "../../servicios/producto.service"
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {


  UsuarioModel: UsuarioModel = new UsuarioModel();
  constructor(private router: Router, private _categoriaService: CategoriaService, private _productoService: ProductoService) {
  }
  SECRET_KEY = "llaveSecreta";

  categorias: any[] = [];

  productos: any[] = [];

  termino: string;

  contador: number;


  ngOnInit(): void {
    this.validar();
    this.usuario();
    this.getCategorias();
    this.getProductos();
  }

  logout() {
    localStorage.removeItem('sesionID');
    localStorage.removeItem('customer');
    this.ngOnInit();

  }
  validar() {
    if (!localStorage.getItem('sesionID')) {
      this.router.navigateByUrl('/login')
    }
  }
  decrypt(dataToDecrypt) {
    let data = CryptoJS.AES.decrypt(dataToDecrypt, this.SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }
  usuario() {
    let dataUser = this.decrypt(localStorage.getItem("customer"))
    let json = JSON.parse(dataUser);
    this.UsuarioModel.first_name = json.first_name;
    this.UsuarioModel.middle_name = json.middle_name;
  }

  getCategorias() {
    this._categoriaService.getCategorias().then((data: any) => {
      this.categorias = data.data.categories;
    }).catch((err) => {
      console.log(err);
    })
  }

  getProductos() {
    this._productoService.getProductos().then((data: any) => {
      this.productos = data.data.items;
      this.contador = this.productos.length;
    }).catch((err) => {
      console.log(err);
    })
  }
}
