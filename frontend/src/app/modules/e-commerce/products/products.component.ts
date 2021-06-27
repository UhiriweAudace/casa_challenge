// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { ProductsService } from '../_services';
import { Product } from '../_models/product.model';
import { HttpHeaders } from '@angular/common/http';
import { AuthModel } from '../../auth/_models/auth.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  ingredientList: Product[] | null = null;
  private httpHeaders:HttpHeaders
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  constructor(public productsService: ProductsService, private toast: HotToastService) {}

  // angular lifecycle hooks
  ngOnInit(): void {

    this.getAuthFromLocalStorage()
    this.fetchIngredients();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // actions
  getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      this.httpHeaders = new HttpHeaders({
        Authorization: `Bearer ${authData.accessToken}`,
      });
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  
  fetchIngredients() {
    const ftSub = this.productsService.fetch(this.httpHeaders).subscribe((products: Product[]) => (this.ingredientList = products));
    this.subscriptions.push(ftSub);
  }
  delete(id: string) {
    const delSub = this.productsService
      .delete(id, this.httpHeaders)
      .pipe(this.toast.observe({ loading: 'deleting...', success: s => `${s.message}`, error: e => `${e.error}` }))
      .subscribe(() => this.fetchIngredients());
    this.subscriptions.push(delSub);
  }
}
