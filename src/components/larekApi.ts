import {ProductItem} from "../types";
import {Api, ApiListResponse} from "./base/api";

export class ProductListModel {
    private api: Api;
    products: ProductItem[] = [];

    constructor(api: Api) {
        this.api = api;
    }

    async loadProducts(): Promise<ProductItem[]> {
        try {
            const response = await this.api.get('/product');
            const data = response as ApiListResponse<ProductItem>;
            return this.loadSelectedFromStorage(data.items);
        } catch (error) {
            console.error(error);
            return [];
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

    toggleProductInCart(product: ProductItem): void {
        const existingProduct = this.products.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.selected = !existingProduct.selected;
        }
        this.saveSelectedToStorage();
    }

    removeProductFromCart(productId: string): void {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.selected = false;
            this.saveSelectedToStorage();
        }
    }
}