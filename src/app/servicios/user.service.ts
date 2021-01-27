import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'https://webpro180369.herokuapp.com/storeUtags/user/create_user';
  urlWeb = "http://35.167.62.109/storeutags/security/create_account";
  urlLocal = "http://localhost:3000/storeUtags/user/create_user";
  recaptcha = "https://www.google.com/recaptcha/api2/userverify?k=6LeU0DkaAAAAAMEngXot_2ZLYpNLuaMo_AaFTZtF";
  constructor(private http: HttpClient) { }

  postUsuario(usuario) {

    return this.http.post(this.url, usuario).toPromise();

  }

  getRecaptcha() {
    return this.http.get(this.recaptcha).toPromise();
  }

}