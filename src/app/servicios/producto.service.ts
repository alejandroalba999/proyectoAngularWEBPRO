import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    urlWeb = "http://35.167.62.109/storeutags/catalogs/items/by_text/";

    constructor(private http: HttpClient) { }

    getProductos() {
        return this.http.get(this.urlWeb).toPromise();
    }

}