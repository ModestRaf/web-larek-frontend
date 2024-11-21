import {CartItem, ICart, IProductList, ProductItem} from "../types";
import {EventEmitter} from "./base/events";

export class Cart implements ICart {
    items: CartItem[] = [];
    private productList: IProductList;
    private eventEmitter: EventEmitter;

    constructor(productList: IProductList, eventEmitter: EventEmitter) {
        this.productList = productList;
        this.eventEmitter = eventEmitter;
        this.loadCartFromStorage();
    }

    toggleProductInCart(product: ProductItem, products: ProductItem[]): void {
        const existingProduct = products.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.selected = !existingProduct.selected;
            console.log(`Product ${product.id} selected state changed to ${existingProduct.selected}`);
        } else {
            console.log(`Product ${product.id} not found in products list`);
        }
        this.productList.saveSelectedToStorage();
        this.updateCartItems(products);
        this.notifyProductToggled(product, this.items.length);
    }

    removeProductFromCart(productId: string, products: ProductItem[]): void {
        const product = products.find(p => p.id === productId);
        if (product) {
            product.selected = false;
            console.log(`Product ${productId} removed from cart`);
        } else {
            console.log(`Product ${productId} not found in products list`);
        }
        this.productList.saveSelectedToStorage();
        this.updateCartItems(products);
        this.notifyProductRemoved(productId, this.items.length);
    }

    removeBasketItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        const selectedProductsCount = this.items.length; // Получаем актуальное количество товаров в корзине
        this.notifyBasketItemRemoved(itemId, selectedProductsCount);
        const event = new CustomEvent('productRemoved', {detail: {productId: itemId}});
        window.dispatchEvent(event);
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