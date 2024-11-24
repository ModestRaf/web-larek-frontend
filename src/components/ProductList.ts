import {ProductItem} from "../types";
import {EventEmitter} from "./base/events";

export class ProductList {
    products: ProductItem[] = [];
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
        this.eventEmitter.on<{ productId: string }>('productRemoved', ({productId}) => {
            this.updateSelectedState(productId);
        });
    }

    private updateSelectedState(productId: string): void {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.selected = false;
            this.saveSelectedToStorage();
        }
    }

    saveSelectedToStorage(): void {
        const selectedState = this.products.map(product => ({
            id: product.id,
            selected: product.selected,
        }));
        localStorage.setItem('selectedProducts', JSON.stringify(selectedState));
    }

    loadSelectedFromStorage(products: ProductItem[]): ProductItem[] {
        const savedSelectedState = localStorage.getItem('selectedProducts');
        if (savedSelectedState) {
            const selectedState = JSON.parse(savedSelectedState) as { id: string; selected: boolean }[];
            return products.map(product => {
                const savedProduct = selectedState.find(p => p.id === product.id);
                if (savedProduct) {
                    product.selected = savedProduct.selected;
                }
                return product;
            });
        }
        return products;
    }

    clearSelectedProducts(): void {
        this.products.forEach(product => product.selected = false);
        this.saveSelectedToStorage();
    }
}