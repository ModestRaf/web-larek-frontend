import {CartItem, ProductItem} from "../types";
import {EventEmitter} from "./base/events";

export class Cart {
    items: CartItem[] = [];
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
        this.loadCartFromStorage();
        // Добавляем обработчики для событий
        this.eventEmitter.on('cart:getItems', (callback: (items: CartItem[]) => void) => {
            callback(this.items);
        });
        this.eventEmitter.on('cart:getTotalPrice', (callback: (price: number) => void) => {
            callback(this.getTotalPrice());
        });
        this.eventEmitter.on('cart:getSelectedProductsCount', (callback: (count: number) => void) => {
            callback(this.getSelectedProductsCount());
        });
        this.eventEmitter.on('removeBasketItem', (data: { itemId: string }) => {
            this.removeBasketItem(data.itemId);
        });
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
        }
        this.saveCartToStorage();
        this.notifyProductToggled(product, this.getSelectedProductsCount());
    }

    removeProductFromCart(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.notifyProductRemoved(productId, this.getSelectedProductsCount());
    }

    removeBasketItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        this.notifyBasketItemRemoved(itemId, this.getSelectedProductsCount());
        this.eventEmitter.emit<{ productId: string }>('productRemoved', {productId: itemId});
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

    private notifyProductToggled(product: ProductItem, selectedProductsCount: number): void {
        this.eventEmitter.emit<{ product: ProductItem, selectedProductsCount: number }>('productToggled', {
            product,
            selectedProductsCount
        });
    }

    private notifyProductRemoved(productId: string, selectedProductsCount: number): void {
        this.eventEmitter.emit<{ productId: string, selectedProductsCount: number }>('productRemoved', {
            productId,
            selectedProductsCount
        });
    }

    private notifyBasketItemRemoved(itemId: string, selectedProductsCount: number): void {
        this.eventEmitter.emit<{ itemId: string, selectedProductsCount: number }>('basketItemRemoved', {
            itemId,
            selectedProductsCount
        });
    }
}