import {IProductList, ProductItem} from "../types";

export class ProductList implements IProductList {
    products: ProductItem[] = [];

    constructor() {
        window.addEventListener('productRemoved', (event: CustomEvent) => {
            const productId = event.detail.productId;
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