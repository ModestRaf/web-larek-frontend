import {CartItem, IProductList, IProductListView, ProductItem} from "../types";

export class Cart {
    items: CartItem[] = [];
    private productListView: IProductListView | null = null;
    private productList: IProductList;

    constructor(productList: IProductList) {
        this.productList = productList;
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
    }

    setProductList(productList: IProductListView): void {
        this.productListView = productList;
    }

    removeBasketItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        if (this.productListView) {
            this.productListView.removeProductFromCart(itemId);
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