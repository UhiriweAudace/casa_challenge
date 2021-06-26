// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import { ITableState, TableResponseModel } from '../models/table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { GroupingState } from '../models/grouping.model';
import { environment } from '../../../../../environments/environment';
import { Product } from 'src/app/modules/e-commerce/_models/product.model';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

export abstract class TableService<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }

  protected http: HttpClient;
  // API URL has to be overrided
  API_URL = `${environment.apiUrl}/ingredients`;
  constructor(http: HttpClient) {
    this.http = http;
  }

  // CREATE
  create(item: FormData): Observable<Product> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<Product>(`http://localhost:3000/api/ingredients/create`, item)
  }

  // GET INGREDIENT INFORMATION
  getItemById(id: string): Observable<Product> {
    const url = `http://localhost:3000/api/ingredients/${id}`;
    return this.http.get<Product>(url);
  }

  // UPDATE
  update(itemId:string, formData:FormData): Observable<any> {
    const url = `http://localhost:3000/api/ingredients/${itemId}`;
    return this.http.put(url, formData)
  }

  // DELETE
  delete(id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `http://localhost:3000/api/ingredients/${id}`;
    return this.http.delete(url);
  }

  public fetch() {
    return this.http.get(`http://localhost:3000/api/ingredients`).subscribe((ingredients:T[])=>{
        this._items$.next(ingredients);
    })
  }

}
