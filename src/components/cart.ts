import {CartItem, ICartView, IProductListView, ProductItem} from "../types";

export class Cart {
    items: CartItem[] = [];
    private productList: IProductListView | null = null;
    private cartView: ICartView | null = null;

    constructor() {
        this.loadCartFromStorage();  // Загружаем данные из localStorage при инициализации
    }

    setProductList(productList: IProductListView): void {
        this.productList = productList;
    }

    setCartView(cartView: ICartView): void {
        this.cartView = cartView;
    }

    removeBasketItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCartToStorage();  // Сохраняем изменения
        if (this.productList) {
            this.productList.removeProductFromCart(itemId);
        }
        if (this.cartView) {
            this.cartView.renderBasketItems();
        }
    }

    updateCartItems(products: ProductItem[]): void {
        this.items = products.filter(product => product.selected).map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
        }));
        this.saveCartToStorage();  // Сохраняем изменения
        if (this.cartView) {
            this.cartView.renderBasketItems();
        }
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    clearCart(): void {
        this.items = [];
        this.saveCartToStorage();  // Очищаем localStorage
        if (this.cartView) {
            this.cartView.renderBasketItems();
        }
    }

    // Сохраняем текущее состояние корзины в localStorage
    private saveCartToStorage(): void {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    // Загружаем состояние корзины из localStorage
    private loadCartFromStorage(): void {
        const savedItems = localStorage.getItem('cartItems');
        if (savedItems) {
            this.items = JSON.parse(savedItems);
        }
    }
}