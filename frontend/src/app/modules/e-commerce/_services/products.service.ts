import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Product } from '../_models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http:HttpClient) {}
  private _items$ = new BehaviorSubject<Product[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  
  API_URL = 'https://api.spoonacular.com/food/ingredients';
  INGREDIENT_API_URL = 'http://localhost:3000/api/ingredients';
  SPOONACULAR_IMG_API_URL = 'https://spoonacular.com/cdn/ingredients_100x100';


  // Getters
  get items$(){
      return this._items$.asObservable()
  }

  get isLoading$() {
    return this._isLoading$.asObservable();
  }

  searchNutrition(product_name:string){
      return this.http.get(`${this.API_URL}/search?query=${product_name}&apiKey=${environment.SEARCH_API_KEY}`)
  }

  getIngredientInformation(id:number, amount:number =100, unit:string='g'){
    return this.http.get(`${this.API_URL}/${id}/information?amount=${amount}&unit=${unit}&apiKey=${environment.SEARCH_API_KEY}`)
  }

  formatNutritionImageUrl(image:string){
      return  `${this.SPOONACULAR_IMG_API_URL}/${image}`
  }

  fetchImage(url:string){
      return `${url}?apiKey=${environment.SEARCH_API_KEY}`
  }
    // CREATE
    create(item: FormData, headers:HttpHeaders): Observable<Product> {
        return this.http.post<Product>(`${this.INGREDIENT_API_URL}/create`, item,{headers})
      }
    
      // GET INGREDIENT INFORMATION
      getItemById(id: string,  headers:HttpHeaders): Observable<Product> {
        const url = `${this.INGREDIENT_API_URL}/${id}`;
        return this.http.get<Product>(url,{headers});
      }
    
      // UPDATE
      update(itemId:string, formData:FormData,  headers:HttpHeaders): Observable<any> {
        const url = `${this.INGREDIENT_API_URL}/${itemId}`;
        return this.http.put(url, formData,{headers})
      }
    
      // DELETE
      delete(id: any, headers:HttpHeaders): Observable<any> {
        const url = `${this.INGREDIENT_API_URL}/${id}`;
        return this.http.delete(url,{headers});
      }
    
      // GET ALL INGREDIENTS
      fetch(headers:HttpHeaders):Observable<any> {
        return this.http.get(`http://localhost:3000/api/ingredients`,{headers})
    //     .pipe().subscribe((ingredients:Product[])=>{
    //         console.log("--- Ingredients --->", ingredients)
    //     this._items$.next(ingredients);
    //     return of(ingredients)
    // })
      }
}
