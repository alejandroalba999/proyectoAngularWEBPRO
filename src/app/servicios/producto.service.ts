import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    urlWeb = "http://35.167.62.109/storeutags/catalogs/items/";

    constructor(private http: HttpClient) { }

    getProductos(termino: string) {
        if (termino == undefined) {
            return this.http.get(this.urlWeb + "by_text /").toPromise();
        } else {
            return this.http.get(this.urlWeb + "by_text/" + termino).toPromise();
        }
    }



}