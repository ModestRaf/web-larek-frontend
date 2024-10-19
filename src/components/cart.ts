import {CartItem} from "../types";
import {ProductListView} from "./larekView";

export class CartModel {
    items: CartItem[] = [];  // Массив товаров в корзине
    private productList: ProductListView | null = null; // Добавляем ссылку на ProductListView

    setProductList(productList: ProductListView): void {
        this.productList = productList;
    }

    removeBasketItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
        if (this.productList) {
            this.productList.removeProductFromCart(itemId);
        }
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + item.price, 0);
    }
}