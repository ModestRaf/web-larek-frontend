import {CartItem, IProductListView, ProductItem} from "../types";

export class Cart {
    items: CartItem[] = [];
    private productList: IProductListView | null = null;

    constructor() {
        this.loadCartFromStorage();
    }

    setProductList(productList: IProductListView): void {
        this.productList = productList;
    }

    removeBasketItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        if (this.productList) {
            this.productList.removeProductFromCart(itemId);
        }
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