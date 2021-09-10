import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
    selector:'pm-products',
    templateUrl:'./product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    providers:[ProductService]
})
export class ProductListComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Product List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    //listFilter: string = 'cart';
    private _listFilter: string = '';
    errorMessage: string = '';
    sub!: Subscription;

    constructor(private productService: ProductService)
    {

    }

    get listFilter(): string{
        return this._listFilter;
    }
    set listFilter(value: string){
        this._listFilter = value;
        console.log('filter saved (set)');

        this.filteredProducts = this.performFilter(value);
        
    }
    filteredProducts: IProduct[] = [];
    products: IProduct[] = [];

    ngOnInit(): void {
        console.log('On init activated');
        
        this._listFilter = '';
        this.sub = this.productService.getProducts().subscribe({
            next: products => {
                this.products = products,
                this.filteredProducts = this.products;
            },
            error: err => this.errorMessage = err
        });
        //this.filteredProducts = this.performFilter('');
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    toggleImage(): void
    {
        this.showImage = !this.showImage;
    }
    
    performFilter(filterBy: string): IProduct[] {
        filterBy = filterBy.toLowerCase();

        return this.products.filter((product: IProduct) => 
            product.productName.toLowerCase().includes(filterBy));
    }

    onRatingClicked(message: string) :void{
        this.pageTitle = 'Product List: ' + message;
    }

}