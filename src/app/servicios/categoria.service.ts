import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {

    urlWeb = "http://35.167.62.109/storeutags/catalogs/categories";

    constructor(private http: HttpClient) { }

    getCategorias() {
        return this.http.get(this.urlWeb).toPromise();
    }

}