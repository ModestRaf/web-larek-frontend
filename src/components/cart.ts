import {CartItem, ProductItem} from "../types";
import {EventEmitter} from "./base/events";

export class Cart {
    items: CartItem[] = [];
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
        this.loadCartFromStorage();
    }

    toggleProductInCart(product: ProductItem): void {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            this.removeProductFromCart(product.id);
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
            });
            this.saveCartToStorage();
            this.eventEmitter.emit<{ product: ProductItem, selectedProductsCount: number }>('updateCounter', {
                product,
                selectedProductsCount: this.getSelectedProductsCount()
            });
        }
    }

    removeProductFromCart(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.eventEmitter.emit<{ productId: string, selectedProductsCount: number }>('productRemoved', {
            productId,
            selectedProductsCount: this.getSelectedProductsCount()
        });
    }

    updateCartItems(products: ProductItem[]): void {
        this.items = products.filter(product => product.selected).map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
        }));
        this.saveCartToStorage();
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    clearCart(): void {
        this.items = [];
        this.saveCartToStorage();
    }

    getSelectedProductsCount(): number {
        return this.items.length;
    }

    private saveCartToStorage(): void {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    private loadCartFromStorage(): void {
        const savedItems = localStorage.getItem('cartItems');
        if (savedItems) {
            this.items = JSON.parse(savedItems);
        }
    }
}