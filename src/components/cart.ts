import {CartItem, ICartView, IProductListView, ProductItem} from "../types";

export class Cart {
    items: CartItem[] = [];
    private productList: IProductListView | null = null;
    private cartView: ICartView | null = null;

    setProductList(productList: IProductListView): void {
        this.productList = productList;
    }

    setCartView(cartView: ICartView): void {
        this.cartView = cartView;
    }

    removeBasketItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
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
        if (this.cartView) {
            this.cartView.renderBasketItems();
        }
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    clearCart(): void {
        this.items = [];
        if (this.cartView) {
            this.cartView.renderBasketItems();
        }
    }
}