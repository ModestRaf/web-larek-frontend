import {ProductItem} from "../types";

export class ProductList {
    products: ProductItem[] = [];

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