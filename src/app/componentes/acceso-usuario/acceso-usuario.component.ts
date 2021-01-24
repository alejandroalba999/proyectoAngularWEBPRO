import { Component, OnInit } from '@angular/core';
import { UserService } from '../../servicios/user.service';

@Component({
  selector: 'app-acceso-usuario',
  templateUrl: './acceso-usuario.component.html',
  styleUrls: ['./acceso-usuario.component.css']
})
export class AccesoUsuarioComponent implements OnInit {

  constructor(private _service: UserService) { }

  ngOnInit(): void {
    this._service.getClima().then((data: any) => {
      console.log(data);

    }).catch((err) => {
      console.log(err);

    })
  }
  alerta() {
    alert("hola");
  }

}
