import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable , throwError} from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath = 'api/categories';

  constructor(private httpCliente: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.httpCliente.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCaterories)
    );
  }

  getById(id: number): Observable<Category> {

    const url = `${this.apiPath}/${id}`;

    return this.httpCliente.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    );
  }

  create(category: Category): Observable<Category> {
    return this.httpCliente.post(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    );
  }

  update(category: Category): Observable<Category> {
    const url = `${this.apiPath}/${category.id}`;

    return this.httpCliente.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.httpCliente.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  // Metodos privados
  private jsonDataToCaterories(jsonData: any): Category[] {
    const categories: Category[] = [];
    jsonData.array.forEach(element => categories.push(element as Category));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro ao realizar a requisição => ', error);
    return throwError(error);
  }

}
