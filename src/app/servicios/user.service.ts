import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../modelos/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'https://webpro180369.herokuapp.com/storeUtags/user/create_user';
  urlWeb = "http://35.167.62.109/storeutags/security/";
  recaptcha = "https://www.google.com/recaptcha/api2/userverify?k=6LeU0DkaAAAAAMEngXot_2ZLYpNLuaMo_AaFTZtF";

  constructor(private http: HttpClient) { }

  postUsuario(usuario) {

    return this.http.post(this.url, usuario).toPromise();

  }
  recoveryPassword(correo) {
    return this.http.post(this.urlWeb + "request_recovery_code", correo).toPromise();
  }
  validateRecoveryCode(PinModel) {
    return this.http.post(this.urlWeb + "validate_recovery_code", PinModel).toPromise();
  }
  getRecaptcha() {
    return this.http.get(this.recaptcha).toPromise();
  }

  changePassword(UsuarioModel) {
    return this.http.post(this.urlWeb + "update_password", UsuarioModel).toPromise();
  }

  login(UsuarioModel) {
    return this.http.post(this.urlWeb + "login", UsuarioModel).toPromise();
  }

  sessionValidate(sessionID) {
    return this.http.post(this.urlWeb + "ping", sessionID).toPromise();
  }

  //

}