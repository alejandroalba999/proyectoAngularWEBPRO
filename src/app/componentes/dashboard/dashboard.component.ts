import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from "../../servicios/categoria.service";
import { ProductoService } from "../../servicios/producto.service"
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {



  constructor(private router: Router, private _categoriaService: CategoriaService, private _productoService: ProductoService) {
  }


  categorias: any[] = [];

  productos: any[] = [];

  termino: string;

  contador: number;

  array: any = []

  mostrarNoRegistros: boolean = true;

  ngOnInit(): void {
    this.getCategorias();
    this.getProductos();
  }

  getCategorias() {
    this._categoriaService.getCategorias().then((data: any) => {
      this.categorias = data.data.categories;
    }).catch((err) => {
      console.log(err);
    })
  }

  limpiar() {
    this.termino = '';
    this.getProductos();
  }

  getProductos() {
    this._productoService.getProductos(this.termino).then((data: any) => {
      if (!data.data || data.data === undefined) {
        this.mostrarNoRegistros = false;
        this.productos = [];
      } else {
        this.productos = [];
        this.productos = data.data.items;
        this.mostrarNoRegistros = true;
      }

      if (this.productos.length < 0 || !data.data) {
        this.contador = 0;
      } else {
        this.contador = this.productos.length;
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  async categoriass(i) {
    this.termino = "";
    let stringArray: String = "";
    function removeItemFromArr(arr, item) {
      var i = arr.indexOf(item);
      arr.splice(i, 1);
    }
    var slider = <HTMLInputElement>document.getElementById('categorias' + i);
    if (slider.checked) {
      this.array.push(slider.value)
      this.array.filter((v, i, a) => a.indexOf(v) === i);
    } else if (!slider.checked) {
      removeItemFromArr(this.array, slider.value);
    }

    this.array.forEach(element => {
      let a = element.toString();
      stringArray += a + ";";
    });
    await this._categoriaService.getCategoriasConcat(stringArray).then((res: any) => {
      this.productos = res.data.items;
      this.contador = this.productos.length;

    }).catch((err: HttpErrorResponse) => {
      console.log(err);

    })
  }




}