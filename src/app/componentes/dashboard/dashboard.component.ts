import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../modelos/usuario.model';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {


  UsuarioModel: UsuarioModel = new UsuarioModel();
  constructor(private router: Router) { }
  SECRET_KEY = "llaveSecreta";

  ngOnInit(): void {
    this.validar();
    this.usuario();
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


}
