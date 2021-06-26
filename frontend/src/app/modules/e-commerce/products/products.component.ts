// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { ProductsService } from '../_services';
import { Product } from '../_models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  ingredientList: Product[] | null = null;
  constructor(public productsService: ProductsService, private toast: HotToastService) {}

  // angular lifecycle hooks
  ngOnInit(): void {
    this.fetchIngredients();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // actions
  fetchIngredients() {
    const ftSub = this.productsService.fetch().subscribe((products: Product[]) => (this.ingredientList = products));
    this.subscriptions.push(ftSub);
  }
  delete(id: string) {
    const delSub = this.productsService
      .delete(id)
      .pipe(this.toast.observe({ loading: 'deleting...', success: s => `${s.message}`, error: e => `${e.error}` }))
      .subscribe(() => this.fetchIngredients());
    this.subscriptions.push(delSub);
  }
}
