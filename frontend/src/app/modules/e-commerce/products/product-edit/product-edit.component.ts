import { Component, OnDestroy, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product, Ingredient, IngredientNutrition } from '../../_models/product.model';
import { ProductsService } from '../../_services';
import { HotToastService } from '@ngneat/hot-toast';

const EMPTY_PRODUCT: Product = {
    id: undefined,
    product_name: '',
    ingredient_fat: 0,
    ingredient_calories: 0,
    ingredient_carbohydrates: 0,
};

@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit, OnDestroy {
    id: string;
    product: Product;
    previous: Product;
    formGroup: FormGroup;
    isLoading$: Observable<boolean>;
    errorMessage = '';
    tabs = {
        BASIC_TAB: 0,
    };
    activeTabId = 0;
    isSearching:boolean=false;
    private subscriptions: Subscription[] = [];

    constructor(private fb: FormBuilder, private productsService: ProductsService, private router: Router, private route: ActivatedRoute, private toast: HotToastService) {}

    ngOnInit(): void {
        this.isLoading$ = this.productsService.isLoading$;
        this.loadProduct();
    }

    loadProduct() {
        const sb = this.route.paramMap
            .pipe(
                switchMap(params => {
                    // get id from URL
                    this.id = params.get('id');
                    if (this.id) {
                        return this.productsService.getItemById(this.id);
                    }
                    return of(EMPTY_PRODUCT);
                }),
                catchError(errorMessage => {
                    this.errorMessage = errorMessage;
                    return of(undefined);
                }),
            )
            .subscribe((res: Product & { ingredient_name: string; imageUrl: string }) => {
                if (!res) {
                    this.IngredientImageUrl = null;
                    this.selectedFile = null;
                    this.id = undefined;
                    this.product = EMPTY_PRODUCT;
                    this.loadForm();
                    return;
                }

                this.product = res;
                this.product.product_name = res.ingredient_name;
                this.IngredientImageUrl = res.imageUrl;
                this.previous = Object.assign({}, res);
                this.loadForm();
            });
        this.subscriptions.push(sb);
    }

    loadForm() {
        // if (!this.product) {
        //   return;
        // }

        this.formGroup = this.fb.group({
            product_name: [this.product.product_name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            ingredient_fat: [this.product.ingredient_fat, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            ingredient_calories: [this.product.ingredient_calories],
            ingredient_carbohydrates: [this.product.ingredient_carbohydrates],
        });
    }

    reset() {
        if (!this.previous) {
            return;
        }

        this.product = Object.assign({}, this.previous);
        this.IngredientImageUrl = null;
        this.ImgUrl = '';
        this.selectedFile = null;
        this.loadForm();
    }

    save() {
        this.formGroup.markAllAsTouched();
        if (!this.formGroup.valid) {
            return;
        }

        const formValues = this.formGroup.value;
        this.product = Object.assign(this.product, formValues);
        if (this.id) {
            this.edit();
        } else {
            this.create();
        }
    }

    edit() {
        const ingredientUpdatedData = {
            name: this.product.product_name,
            fat: this.product.ingredient_fat,
            calories: this.product.ingredient_calories,
            carbohydrates: this.product.ingredient_carbohydrates,
            imageUrl: this.originalImage,
        };
        const formData = new FormData();
        this.selectedFile && formData.append('image', this.selectedFile);
        formData.append('ingredient', JSON.stringify(ingredientUpdatedData));

        const sbUpdate = this.productsService
            .update(this.id, formData)
            .pipe(this.toast.observe({ loading: 'saving...', success: (s: Product & { message: string }) => s.message, error: e => `${JSON.stringify(e, null, 2)}` }))
            .subscribe(
                () => this.router.navigate(['/ingredients/list']),
                err => console.error('WRONG:', err),
            );
        this.subscriptions.push(sbUpdate);
    }

    create() {
        const IngredientData = {
            name: this.product.product_name,
            fat: this.product.ingredient_fat,
            calories: this.product.ingredient_calories,
            carbohydrates: this.product.ingredient_carbohydrates,
            imageUrl: this.originalImage,
        };
        const formData = new FormData();
        this.selectedFile && formData.append('image', this.selectedFile);
        formData.append('ingredient', JSON.stringify(IngredientData));

        const sbCreate = this.productsService
            .create(formData)
            .pipe(this.toast.observe({ loading: 'creating...', success: (s: Product & { message: string }) => s.message, error: e => `${e}` }))
            .subscribe(
                (res: Product & { message: string }) => {
                    this.product = Object.assign({}, this.previous);
                    this.loadForm();
                    this.router.navigate(['/ingredients/list']);
                },
                errorMessage => {
                    console.error('CREATE ERROR', errorMessage);
                },
            );
        this.subscriptions.push(sbCreate);
    }

    changeTab(tabId: number) {
        this.activeTabId = tabId;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    // helpers for View
    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation: string, controlName: string) {
        const control = this.formGroup.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.dirty || control.touched;
    }

    ImgUrl: string = 'assets/media/bg/bg-3.jpg';
    IngredientImageUrl: null | string = null;
    selectedFile: null | Blob = null;
    originalImage: string | null = null;

    // on select your own image
    onSelectFile(event) {
        if (event.target.files) {
            this.IngredientImageUrl = null;
            this.originalImage = null;
            this.selectedFile = event.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = event => {
                this.ImgUrl = event.target.result as string;
            };
        }
    }

    // on search handler
    onSearchHandler(event) {
        this.isSearching = true
        if (event.target.value) {
            const foundIngredient = this.productsService
                .searchNutrition(event.target.value)
                .pipe()
                .subscribe(({ results }: Ingredient) => {
                    if (results[0]) {
                        const ingredientInfo = this.productsService
                            .getIngredientInformation(results[0].id)
                            .pipe()
                            .subscribe(({ image, nutrition: { nutrients } }: IngredientNutrition) => {
                                this.product.product_name = results[0].name;
                                this.product.ingredient_fat = nutrients.find(nutr => nutr.name === 'Fat').amount;
                                this.product.ingredient_calories = nutrients.find(nutr => nutr.name === 'Calories').amount;
                                this.product.ingredient_carbohydrates = nutrients.find(nutr => nutr.name === 'Carbohydrates').amount;

                                const imageURL = this.productsService.formatNutritionImageUrl(image);
                                this.IngredientImageUrl = this.productsService.fetchImage(imageURL);

                                this.originalImage = imageURL;
                                this.selectedFile = null;
                                this.loadForm();
                                this.toast.success('Ingredient information found.');
                                this.isSearching =false;
                            });
                        this.subscriptions.push(ingredientInfo);
                    }
                });
            this.subscriptions.push(foundIngredient);
        }
    }
}
