import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    urlWeb = "http://35.167.62.109/storeutags/catalogs/items/";

    urlProducto = "http://35.167.62.109/storeutags/catalogs/item_details/"

    urlCart = "http://35.167.62.109/storeutags/cart/"





    constructor(private http: HttpClient) { }

    getProductos(termino: string) {
        if (termino == undefined) {
            return this.http.get(this.urlWeb + "by_text /").toPromise();
        } else {
            return this.http.get(this.urlWeb + "by_text/" + termino).toPromise();
        }
    }

    getProductoID(idProducto) {
        return this.http.get(this.urlProducto + idProducto).toPromise();
    }

    guardarCarrito(carrito: any) {
        return this.http.post(this.urlCart + "add_item", carrito).toPromise();
    }

    obtenerCarrito(sessionID: any) {
        return this.http.post(this.urlCart + "get_details", sessionID).toPromise();
    }



}